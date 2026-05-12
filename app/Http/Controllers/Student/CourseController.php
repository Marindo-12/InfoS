<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSession;
use App\Models\Enrollment;
use App\Models\EnrollmentApplication;
use App\Models\PortalNotification;
use App\Support\EnrollmentAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with('course')
            ->where('user_id', $user->id)
            ->orderByDesc('progress')
            ->get();
        $courseIds = $enrollments->pluck('course_id')->filter()->values();

        $pendingApplications = EnrollmentApplication::query()
            ->with('course')
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->latest()
            ->get();

        $requestedCourseIds = $pendingApplications->pluck('course_id')->filter()->values();
        $blockedCourseIds = $courseIds->merge($requestedCourseIds)->unique()->values();

        $availableCourses = Course::query()
            ->where('status', 'active')
            ->when($blockedCourseIds->isNotEmpty(), fn ($query) => $query->whereNotIn('id', $blockedCourseIds))
            ->orderBy('category')
            ->orderBy('title')
            ->get()
            ->map(fn (Course $course) => $this->formatAvailableCourse($course))
            ->values();

        $featuredEnrollment = $enrollments->first();
        $sideEnrollments = $enrollments->slice(1)->values();

        $stats = [
            [
                'label' => 'Formations actives',
                'value' => (string) $enrollments->where('status', 'active')->count(),
                'sub' => 'sur votre session actuelle',
            ],
            [
                'label' => 'Heures de cours',
                'value' => $enrollments->sum(fn (Enrollment $enrollment) => (int) ($enrollment->course->duration_hours ?? 0)).'h',
                'sub' => 'volume total des modules',
            ],
            [
                'label' => 'Progression moyenne',
                'value' => (string) round($enrollments->avg('progress') ?? 0).'%',
                'sub' => 'sur l ensemble des parcours',
            ],
        ];

        $weeklyMetrics = $this->weeklyMetrics($courseIds);

        $schedule = $enrollments
            ->filter(fn (Enrollment $enrollment) => $enrollment->next_session_at !== null)
            ->sortBy('next_session_at')
            ->take(3)
            ->values()
            ->map(function (Enrollment $enrollment, int $index) {
                $date = $enrollment->next_session_at;

                return [
                    'day' => $date->format('d'),
                    'month' => strtoupper($date->locale('fr')->translatedFormat('M')),
                    'course' => $enrollment->course->title,
                    'time' => $date->format('H:i'),
                    'room' => $enrollment->room,
                    'active' => $index === 0,
                ];
            });

        return Inertia::render('Dashboard/Student/MyCourses', [
            'stats' => $stats,
            'featuredCourse' => $featuredEnrollment ? $this->formatEnrollment($featuredEnrollment, true) : null,
            'sideCourses' => $sideEnrollments->map(fn (Enrollment $enrollment) => $this->formatEnrollment($enrollment, false))->values(),
            'weeklyMetrics' => $weeklyMetrics,
            'schedule' => $schedule,
            'availableCourses' => $availableCourses,
            'pendingApplications' => $pendingApplications
                ->map(fn (EnrollmentApplication $application) => $this->formatApplication($application))
                ->values(),
        ]);
    }

    public function storeApplication(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'payment_method' => ['required', 'in:online,onsite'],
            'payment_reference' => ['nullable', 'string', 'max:190'],
            'preferred_payment_date' => ['nullable', 'date', 'after_or_equal:today'],
        ]);

        $course = Course::query()
            ->where('status', 'active')
            ->findOrFail($validated['course_id']);

        $alreadyEnrolled = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        $alreadyRequested = EnrollmentApplication::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($alreadyEnrolled || $alreadyRequested) {
            return back()->withErrors([
                'course_id' => 'Vous avez deja une inscription ou une demande en cours pour cette formation.',
            ])->withInput();
        }

        $nameParts = preg_split('/\s+/', trim($user->name), 2);
        $firstName = $nameParts[0] ?: $user->name;
        $lastName = $nameParts[1] ?? '';

        $application = DB::transaction(function () use ($course, $user, $validated, $firstName, $lastName) {
            $application = EnrollmentApplication::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'reference' => 'INS-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => Str::lower($user->email),
                'phone' => $user->phone,
                'category' => $course->category,
                'training_label' => $course->title,
                'amount' => $course->price,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'online' ? 'paid' : 'pending',
                'payment_reference' => $validated['payment_reference'] ?? null,
                'preferred_payment_date' => $validated['preferred_payment_date'] ?? null,
                'status' => 'pending',
                'form_data' => [
                    'source' => 'student_portal',
                    'existing_student' => true,
                ],
            ]);

            foreach (EnrollmentAccess::adminUsers() as $admin) {
                PortalNotification::create([
                    'user_id' => $admin->id,
                    'category' => 'application',
                    'title' => 'Nouvelle demande d inscription',
                    'message' => $user->name.' demande a rejoindre '.$course->title.'.',
                    'icon' => 'how_to_reg',
                    'action_label' => 'Voir la demande',
                    'action_url' => route('admin.applications', absolute: false),
                    'published_at' => now(),
                ]);
            }

            return $application;
        });

        return back()->with('success', 'Votre demande '.$application->reference.' a ete envoyee a l administration.');
    }

    private function formatEnrollment(Enrollment $enrollment, bool $featured): array
    {
        $course = $enrollment->course;

        return [
            'category' => $course->category,
            'title' => $course->title,
            'description' => $course->description,
            'price' => number_format((float) $course->price, 0, ',', ' ').' DH',
            'duration' => $course->duration_weeks
                ? $course->duration_weeks.' semaines'
                : (($course->duration_hours ?? 0).'h'),
            'group' => $enrollment->group_name,
            'progress' => $enrollment->progress,
            'payment' => $enrollment->payment_status === 'paid' ? 'Paiement valide' : 'Paiement en cours',
            'nextSession' => $enrollment->next_session_at?->locale('fr')->translatedFormat('l d F'),
            'nextTime' => $enrollment->next_session_at?->format('H:i'),
            'room' => $enrollment->room,
            'status' => $featured
                ? 'Principal'
                : match (true) {
                    $enrollment->progress >= 90 => 'Presque termine',
                    $enrollment->progress >= 50 => 'Bien avance',
                    default => 'En cours',
                },
            'accent' => match ($course->category) {
                'Infographie' => '#ff6b2b',
                'Bureautique' => '#0f9d70',
                'Langues' => '#3b82f6',
                default => '#ff6b2b',
            },
        ];
    }

    private function formatAvailableCourse(Course $course): array
    {
        return [
            'id' => $course->id,
            'category' => $course->category,
            'title' => $course->title,
            'description' => $course->description,
            'price' => number_format((float) $course->price, 0, ',', ' ').' DH',
            'amount' => (float) $course->price,
            'duration' => $course->duration_weeks
                ? $course->duration_weeks.' semaines'
                : (($course->duration_hours ?? 0).'h'),
            'startsAt' => $course->starts_at?->locale('fr')->translatedFormat('d F Y'),
            'level' => $course->level,
            'capacity' => $course->capacity,
        ];
    }

    private function formatApplication(EnrollmentApplication $application): array
    {
        return [
            'id' => $application->id,
            'reference' => $application->reference,
            'course' => $application->course?->title ?? $application->training_label,
            'category' => $application->category,
            'amount' => number_format((float) $application->amount, 0, ',', ' ').' DH',
            'paymentMethod' => $application->payment_method,
            'paymentStatus' => $application->payment_status,
            'status' => $application->status,
            'createdAt' => optional($application->created_at)->format('d/m/Y'),
        ];
    }

    private function weeklyMetrics($courseIds)
    {
        $weekStarts = collect(range(3, 0))
            ->map(fn (int $offset) => now()->startOfWeek()->subWeeks($offset));

        if ($courseIds->isEmpty()) {
            return $weekStarts
                ->values()
                ->map(fn ($weekStart, int $index) => [
                    'week' => 'S'.($index + 1),
                    'hours' => 0,
                    'sessions' => 0,
                ]);
        }

        $periodStart = $weekStarts->first()->copy()->startOfDay();
        $periodEnd = $weekStarts->last()->copy()->endOfWeek();

        $sessions = CourseSession::query()
            ->whereIn('course_id', $courseIds)
            ->whereBetween('starts_at', [$periodStart, $periodEnd])
            ->whereIn('status', ['scheduled', 'completed'])
            ->get();

        return $weekStarts
            ->values()
            ->map(function ($weekStart, int $index) use ($sessions) {
                $weekEnd = $weekStart->copy()->endOfWeek();
                $weekSessions = $sessions->filter(
                    fn (CourseSession $session) => $session->starts_at->betweenIncluded($weekStart, $weekEnd)
                );

                $minutes = $weekSessions->sum(function (CourseSession $session) {
                    if ($session->duration_minutes) {
                        return (int) $session->duration_minutes;
                    }

                    return $session->ends_at
                        ? $session->starts_at->diffInMinutes($session->ends_at)
                        : 0;
                });

                return [
                    'week' => 'S'.($index + 1),
                    'hours' => round($minutes / 60, 1),
                    'sessions' => $weekSessions->count(),
                ];
            });
    }
}
