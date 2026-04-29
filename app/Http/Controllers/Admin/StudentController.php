<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        $students = User::query()
            ->where('role', 'student')
            ->with(['enrollments.course', 'enrollments.payments'])
            ->orderByDesc('created_at')
            ->get();

        $totalRevenue = (float) Payment::query()
            ->where('status', 'paid')
            ->sum('amount');

        $stats = [
            [
                'label' => 'Total etudiants',
                'value' => number_format($students->count(), 0, ',', ' '),
                'sub' => 'comptes etudiants actifs',
                'accent' => 'orange',
            ],
            [
                'label' => 'Nouveaux inscrits',
                'value' => number_format($students->where('created_at', '>=', now()->subDays(30))->count(), 0, ',', ' '),
                'sub' => 'sur les 30 derniers jours',
                'accent' => 'blue',
            ],
            [
                'label' => 'Revenu encaisse',
                'value' => number_format($totalRevenue, 0, ',', ' ').' DH',
                'sub' => 'paiements confirmes',
                'accent' => 'green',
            ],
            [
                'label' => 'Formations actives',
                'value' => number_format(Course::query()->where('status', 'active')->count(), 0, ',', ' '),
                'sub' => 'catalogue actuellement ouvert',
                'accent' => 'slate',
            ],
        ];

        $recentStudents = $students
            ->take(4)
            ->values()
            ->map(function (User $student) {
                $latestEnrollment = $student->enrollments->sortByDesc('created_at')->first();

                return [
                    'name' => $student->name,
                    'email' => $student->email,
                    'course' => $latestEnrollment?->course?->title ?? 'Aucune formation',
                    'joinedAt' => $student->created_at?->format('d/m/Y'),
                ];
            });

        $studentRows = $students->map(function (User $student) {
            $latestEnrollment = $student->enrollments->sortByDesc('created_at')->first();
            $paidTotal = (float) $student->enrollments
                ->flatMap->payments
                ->where('status', 'paid')
                ->sum('amount');
            $dueTotal = (float) $student->enrollments->sum(fn (Enrollment $enrollment) => (float) $enrollment->course->price);

            $paymentStatus = match (true) {
                $dueTotal <= 0 => 'non defini',
                $paidTotal >= $dueTotal => 'paye',
                $paidTotal > 0 => 'partiel',
                default => 'retard',
            };

            return [
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'course' => $latestEnrollment?->course?->title ?? 'Aucune formation',
                'progress' => $latestEnrollment?->progress ?? 0,
                'paymentStatus' => $paymentStatus,
                'lastSeen' => $student->updated_at?->diffForHumans(),
                'enrollmentsCount' => $student->enrollments->count(),
            ];
        })->values();

        return Inertia::render('Dashboard/Admin/Students', [
            'stats' => $stats,
            'recentStudents' => $recentStudents,
            'students' => $studentRows,
        ]);
    }
}
