<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSession;
use App\Models\Enrollment;
use App\Models\PortalNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $courses = Course::query()
            ->withCount(['enrollments as active_students_count' => fn ($query) => $query->where('status', 'active')])
            ->orderBy('title')
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category,
                'status' => $course->status,
                'studentsCount' => $course->active_students_count,
            ])
            ->values();

        $sessions = CourseSession::query()
            ->with('course')
            ->orderBy('starts_at')
            ->take(80)
            ->get()
            ->map(fn (CourseSession $session) => $this->formatSession($session))
            ->values();

        return Inertia::render('Dashboard/Admin/Schedule', [
            'courses' => $courses,
            'sessions' => $sessions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedData($request, includeRecurrence: true);
        $recurrence = $validated['recurrence'] ?? 'none';
        $recurrenceDays = $validated['recurrence_days'] ?? [];
        $recurrenceUntil = $validated['recurrence_until'] ?? null;
        unset($validated['recurrence'], $validated['recurrence_days'], $validated['recurrence_until']);

        $session = CourseSession::create($validated);

        if ($recurrence === 'weekly' && $recurrenceUntil && ! empty($recurrenceDays)) {
            $this->createRecurringSessions($session, $recurrenceDays, Carbon::parse($recurrenceUntil));
        }

        $this->syncNextSession($session->course_id);
        $this->notifyStudents($session, 'Nouvelle seance programmee');

        return Redirect::route('admin.schedule')->with('success', 'Seance ajoutee au planning.');
    }

    public function update(Request $request, CourseSession $session): RedirectResponse
    {
        $oldCourseId = $session->course_id;

        $session->update($this->validatedData($request));

        $this->syncNextSession($oldCourseId);
        $this->syncNextSession($session->course_id);
        $this->notifyStudents($session, 'Planning mis a jour');

        return Redirect::route('admin.schedule')->with('success', 'Seance mise a jour.');
    }

    public function destroy(CourseSession $session): RedirectResponse
    {
        $courseId = $session->course_id;
        $session->delete();

        $this->syncNextSession($courseId);

        return Redirect::route('admin.schedule')->with('success', 'Seance supprimee.');
    }

    private function validatedData(Request $request, bool $includeRecurrence = false): array
    {
        $rules = [
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'instructor_name' => ['required', 'string', 'max:255'],
            'room' => ['required', 'string', 'max:120'],
            'group_name' => ['nullable', 'string', 'max:120'],
            'starts_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'status' => ['required', 'in:scheduled,cancelled,completed'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];

        if ($includeRecurrence) {
            $rules['recurrence'] = ['nullable', 'in:none,weekly'];
            $rules['recurrence_days'] = ['nullable', 'array'];
            $rules['recurrence_days.*'] = ['integer', 'min:0', 'max:5'];
            $rules['recurrence_until'] = ['nullable', 'date'];
        }

        $validated = $request->validate($rules);

        $startsAt = Carbon::parse($validated['starts_at']);
        $validated['starts_at'] = $startsAt;
        $validated['ends_at'] = $startsAt->copy()->addMinutes((int) $validated['duration_minutes']);

        return $validated;
    }

    private function createRecurringSessions(CourseSession $source, array $days, Carbon $until): void
    {
        $start = $source->starts_at->copy()->startOfDay();
        $cursor = $start->copy()->addDay();
        $limit = $until->copy()->endOfDay();
        $created = 0;

        while ($cursor->lte($limit) && $created < 80) {
            $dayIndex = $cursor->dayOfWeekIso - 1; // 0=Mon ... 5=Sat

            if (in_array($dayIndex, $days, true)) {
                $startsAt = $cursor->copy()->setTimeFrom($source->starts_at);

                if (! $startsAt->equalTo($source->starts_at)) {
                    CourseSession::create([
                        'course_id' => $source->course_id,
                        'title' => $source->title,
                        'instructor_name' => $source->instructor_name,
                        'room' => $source->room,
                        'group_name' => $source->group_name,
                        'starts_at' => $startsAt,
                        'ends_at' => $startsAt->copy()->addMinutes($source->duration_minutes),
                        'duration_minutes' => $source->duration_minutes,
                        'status' => $source->status,
                        'notes' => $source->notes,
                    ]);
                    $created++;
                }
            }

            $cursor->addDay();
        }
    }

    private function formatSession(CourseSession $session): array
    {
        return [
            'id' => $session->id,
            'courseId' => $session->course_id,
            'courseTitle' => $session->course?->title,
            'title' => $session->title,
            'instructorName' => $session->instructor_name,
            'room' => $session->room,
            'groupName' => $session->group_name,
            'startsAt' => $session->starts_at?->format('Y-m-d\TH:i'),
            'dateLabel' => $session->starts_at?->locale('fr')->translatedFormat('l d F Y'),
            'timeLabel' => $session->starts_at?->format('H:i').' - '.$session->ends_at?->format('H:i'),
            'durationMinutes' => $session->duration_minutes,
            'status' => $session->status,
            'notes' => $session->notes,
        ];
    }

    private function syncNextSession(int $courseId): void
    {
        $next = CourseSession::query()
            ->where('course_id', $courseId)
            ->where('status', 'scheduled')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at')
            ->first();

        Enrollment::query()
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->update([
                'next_session_at' => $next?->starts_at,
                'room' => $next?->room,
            ]);
    }

    private function notifyStudents(CourseSession $session, string $title): void
    {
        $userIds = Enrollment::query()
            ->where('course_id', $session->course_id)
            ->where('status', 'active')
            ->pluck('user_id');

        foreach ($userIds as $userId) {
            PortalNotification::create([
                'user_id' => $userId,
                'category' => 'academic',
                'title' => $title,
                'message' => $session->course?->title.' : '.$session->title.' le '.$session->starts_at->format('d/m/Y').' a '.$session->starts_at->format('H:i').' en '.$session->room.'.',
                'icon' => 'event',
                'action_label' => 'Consulter le planning',
                'action_url' => route('student.schedule'),
                'published_at' => now(),
            ]);
        }
    }
}
