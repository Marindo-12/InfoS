<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\PortalNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with('course')
            ->where('user_id', $user->id)
            ->get();

        $payments = Payment::query()
            ->whereHas('enrollment', fn ($query) => $query->where('user_id', $user->id))
            ->with('enrollment.course')
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at')
            ->get();

        $notifications = PortalNotification::query()
            ->where('user_id', $user->id)
            ->orderByDesc('published_at')
            ->take(3)
            ->get();

        $nextSession = $enrollments
            ->filter(fn (Enrollment $enrollment) => $enrollment->next_session_at !== null)
            ->sortBy('next_session_at')
            ->first();

        $activeCoursesCount = $enrollments->where('status', 'active')->count();
        $upcomingSessionsCount = $enrollments->filter(fn (Enrollment $enrollment) => $enrollment->next_session_at?->isFuture())->count();
        $paidAmount = (float) $payments->where('status', 'paid')->sum('amount');
        $certificatesCount = 0;

        $stats = [
            [
                'label' => 'Formations actives',
                'value' => (string) $activeCoursesCount,
                'sub' => 'parcours actuellement suivis',
                'color' => '#ff6b2b',
                'icon' => 'formation',
            ],
            [
                'label' => 'Seances a venir',
                'value' => (string) $upcomingSessionsCount,
                'sub' => 'prochains rendez-vous planifies',
                'color' => '#3b82f6',
                'icon' => 'calendar',
            ],
            [
                'label' => 'Paiements regles',
                'value' => number_format($paidAmount, 0, ',', ' ').' DH',
                'sub' => 'versements deja valides',
                'color' => '#10b981',
                'icon' => 'payment',
            ],
            [
                'label' => 'Certificats obtenus',
                'value' => (string) $certificatesCount,
                'sub' => 'documents disponibles',
                'color' => '#8b5cf6',
                'icon' => 'certificate',
            ],
        ];

        $courseCards = $enrollments
            ->sortByDesc('progress')
            ->take(3)
            ->values()
            ->map(function (Enrollment $enrollment) {
                return [
                    'title' => $enrollment->course->title,
                    'category' => $enrollment->course->category,
                    'progress' => $enrollment->progress,
                    'description' => $enrollment->course->description,
                ];
            });

        $recentPayments = $payments
            ->take(3)
            ->values()
            ->map(function (Payment $payment) {
                return [
                    'course' => $payment->enrollment->course->title,
                    'amount' => number_format((float) $payment->amount, 2, ',', ' ').' DH',
                    'status' => $payment->status,
                    'date' => optional($payment->paid_at ?? $payment->created_at)->format('d/m/Y'),
                ];
            });

        $notificationCards = $notifications->map(function (PortalNotification $notification) {
            return [
                'title' => $notification->title,
                'message' => $notification->message,
                'category' => $notification->category,
                'timeLabel' => $notification->published_at?->diffForHumans(),
            ];
        });

        return Inertia::render('Dashboard/Student/Dashboard', [
            'stats' => $stats,
            'nextSession' => $nextSession ? [
                'title' => $nextSession->course->title,
                'date' => $nextSession->next_session_at?->locale('fr')->translatedFormat('l d F Y'),
                'time' => $nextSession->next_session_at?->format('H:i'),
                'room' => $nextSession->room,
            ] : null,
            'courseCards' => $courseCards,
            'recentPayments' => $recentPayments,
            'notificationCards' => $notificationCards,
        ]);
    }
}
