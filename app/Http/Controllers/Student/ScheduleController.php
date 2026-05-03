<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseSession;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();

        $enrollments = Enrollment::query()
            ->with('course')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->get();

        $courseIds = $enrollments->pluck('course_id');
        $groupsByCourse = $enrollments->pluck('group_name', 'course_id');

        $sessions = CourseSession::query()
            ->with('course.enrollments')
            ->whereIn('course_id', $courseIds)
            ->where('status', 'scheduled')
            ->whereBetween('starts_at', [$weekStart, $weekEnd])
            ->orderBy('starts_at')
            ->get()
            ->filter(function (CourseSession $session) use ($groupsByCourse) {
                $studentGroup = $groupsByCourse[$session->course_id] ?? null;

                return $session->group_name === null || $session->group_name === $studentGroup;
            })
            ->values();

        $nextSession = CourseSession::query()
            ->with('course')
            ->whereIn('course_id', $courseIds)
            ->where('status', 'scheduled')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at')
            ->get()
            ->first(function (CourseSession $session) use ($groupsByCourse) {
                $studentGroup = $groupsByCourse[$session->course_id] ?? null;

                return $session->group_name === null || $session->group_name === $studentGroup;
            });

        $primaryEnrollment = $nextSession
            ? $enrollments->firstWhere('course_id', $nextSession->course_id)
            : $enrollments->first();

        return Inertia::render('Dashboard/Student/Schedule', [
            'formation' => $this->formationPayload($primaryEnrollment),
            'prochaineCours' => $nextSession ? $this->nextSessionPayload($nextSession) : null,
            'semaine' => $this->weekPayload($weekStart, $sessions),
            'presences' => $enrollments->map(fn (Enrollment $enrollment) => [
                'course' => $enrollment->course?->title ?? 'Formation',
                'attended' => 0,
                'total' => $enrollment->course?->sessions()->where('starts_at', '<', now())->count() ?? 0,
            ])->values(),
            'performances' => [],
            'documents' => [],
            'globalPresence' => 0,
        ]);
    }

    private function formationPayload(?Enrollment $enrollment): array
    {
        $course = $enrollment?->course;

        return [
            'title' => $course?->title ?? 'Aucune formation active',
            'category' => $course?->category ?? 'Planning',
            'startDate' => $course?->starts_at?->locale('fr')->translatedFormat('d M Y') ?? 'A definir',
            'endDate' => $course?->ends_at?->locale('fr')->translatedFormat('d M Y') ?? 'A definir',
            'duration' => $course?->duration_weeks ? $course->duration_weeks.' semaines' : (($course?->duration_hours ?? 0).'h'),
            'studentsCount' => $course?->enrollments()->where('status', 'active')->count() ?? 0,
            'progress' => $enrollment?->progress ?? 0,
        ];
    }

    private function nextSessionPayload(CourseSession $session): array
    {
        return [
            'title' => $session->title,
            'type' => ($session->course?->title ?? 'Formation').' · '.$session->room,
            'room' => $session->room,
            'time' => $session->starts_at->format('H:i'),
            'instructor' => $session->instructor_name,
        ];
    }

    private function weekPayload(Carbon $weekStart, $sessions): array
    {
        return collect(range(0, 6))->map(function (int $offset) use ($weekStart, $sessions) {
            $date = $weekStart->copy()->addDays($offset);
            $daySessions = $sessions
                ->filter(fn (CourseSession $session) => $session->starts_at->isSameDay($date))
                ->map(fn (CourseSession $session) => [
                    'title' => $session->title,
                    'time' => $session->starts_at->format('H:i').' - '.$session->ends_at?->format('H:i'),
                    'room' => $session->room,
                    'color' => $this->colorFor($session->course?->category),
                    'isActive' => now()->between($session->starts_at, $session->ends_at),
                ])
                ->values();

            return [
                'label' => ucfirst($date->locale('fr')->translatedFormat('D')),
                'dayNum' => (int) $date->format('d'),
                'isToday' => $date->isToday(),
                'sessions' => $daySessions,
            ];
        })->values();
    }

    private function colorFor(?string $category): string
    {
        return match ($category) {
            'langues' => 'blue',
            'infographie' => 'red',
            'concours' => 'emerald',
            default => 'orange',
        };
    }
}
