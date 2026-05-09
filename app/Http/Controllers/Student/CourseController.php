<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseSession;
use App\Models\Enrollment;
use Illuminate\Http\Request;
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
        ]);
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
