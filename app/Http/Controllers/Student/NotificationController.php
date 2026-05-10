<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\PaymentInstallment;
use App\Models\PortalNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->string('filter')->toString() ?: 'all';

        $query = PortalNotification::query()
            ->where('user_id', $user->id)
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');

        $notifications = $query->get();
        $allNotifications = PortalNotification::query()
            ->where('user_id', $user->id)
            ->orderByDesc('published_at')
            ->get();

        $upcoming = Enrollment::query()
            ->where('user_id', $user->id)
            ->whereNotNull('next_session_at')
            ->with('course')
            ->orderBy('next_session_at')
            ->take(3)
            ->get()
            ->map(function (Enrollment $enrollment) {
                $date = $enrollment->next_session_at;

                return [
                    'day' => $date->format('d'),
                    'month' => strtoupper($date->locale('fr')->translatedFormat('M')),
                    'title' => $enrollment->course->title,
                    'meta' => $date->format('H:i').' · '.($enrollment->room ?? 'Salle a confirmer'),
                ];
            })
            ->values();

        $nextPendingInstallment = PaymentInstallment::query()
            ->whereHas('enrollment', fn ($query) => $query->where('user_id', $user->id))
            ->where('status', 'pending')
            ->orderBy('due_date')
            ->first();

        $importantNotice = $nextPendingInstallment
            ? [
                'title' => 'Echeance de paiement a venir',
                'message' => 'Une echeance de '.$nextPendingInstallment->amount.' DH approche le '.$nextPendingInstallment->due_date?->format('d/m/Y').'. Pensez a regulariser votre dossier a temps.',
                'actionLabel' => 'Voir les paiements',
                'actionUrl' => route('student.payment'),
              ]
            : [
                'title' => 'Aucune urgence signalee',
                'message' => 'Votre espace etudiant est a jour pour le moment. Continuez a suivre vos notifications academiques et administratives.',
                'actionLabel' => 'Voir mes formations',
                'actionUrl' => route('student.courses'),
              ];

        return Inertia::render('Dashboard/Student/Notifications', [
            'filters' => [
                ['key' => 'all', 'label' => 'Tout', 'count' => $allNotifications->count()],
                ['key' => 'academic', 'label' => 'Academique', 'count' => $allNotifications->where('category', 'academic')->count()],
                ['key' => 'financial', 'label' => 'Financier', 'count' => $allNotifications->where('category', 'financial')->count()],
                ['key' => 'news', 'label' => 'Actualites', 'count' => $allNotifications->where('category', 'news')->count()],
            ],
            'activeFilter' => $filter,
            'unreadCount' => $allNotifications->whereNull('read_at')->count(),
            'notifications' => $notifications->map(function (PortalNotification $notification) {
                return [
                    'id' => $notification->id,
                    'category' => $notification->category,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'icon' => $notification->icon,
                    'isRead' => $notification->read_at !== null,
                    'timeLabel' => $notification->published_at?->diffForHumans(),
                    'actionLabel' => $notification->action_label,
                    'actionUrl' => $notification->action_url,
                ];
            })->values(),
            'importantNotice' => $importantNotice,
            'upcoming' => $upcoming,
        ]);
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        PortalNotification::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
