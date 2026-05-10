<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentApplication;
use App\Models\PortalNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $allNotifications = PortalNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest('published_at')
            ->latest()
            ->get();

        $pendingApplications = EnrollmentApplication::query()
            ->with('course')
            ->where('status', 'pending')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (EnrollmentApplication $application) => [
                'id' => $application->id,
                'reference' => $application->reference,
                'student' => trim($application->first_name.' '.$application->last_name),
                'course' => $application->course?->title ?? $application->training_label,
                'amount' => number_format((float) $application->amount, 0, ',', ' ').' DH',
                'createdAt' => optional($application->created_at)->diffForHumans(),
            ])
            ->values();

        $categoryCounts = $allNotifications
            ->groupBy(fn (PortalNotification $notification) => $this->adminCategory($notification->category))
            ->map->count();

        return Inertia::render('Dashboard/Admin/Notifications', [
            'filters' => [
                ['key' => 'all', 'label' => 'Tout', 'count' => $allNotifications->count()],
                ['key' => 'application', 'label' => 'Candidatures', 'count' => (int) ($categoryCounts['application'] ?? 0)],
                ['key' => 'financial', 'label' => 'Financier', 'count' => (int) ($categoryCounts['financial'] ?? 0)],
                ['key' => 'schedule', 'label' => 'Planning', 'count' => (int) ($categoryCounts['schedule'] ?? 0)],
                ['key' => 'system', 'label' => 'Systeme', 'count' => (int) ($categoryCounts['system'] ?? 0)],
            ],
            'activeFilter' => 'all',
            'unreadCount' => $allNotifications->whereNull('read_at')->count(),
            'pendingCount' => EnrollmentApplication::query()->where('status', 'pending')->count(),
            'notifications' => $allNotifications->map(function (PortalNotification $notification) {
                return [
                    'id' => $notification->id,
                    'category' => $this->adminCategory($notification->category),
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'icon' => $notification->icon ?: 'notifications',
                    'isRead' => $notification->read_at !== null,
                    'timeLabel' => optional($notification->published_at ?? $notification->created_at)->diffForHumans(),
                    'actionLabel' => $notification->action_label,
                    'actionUrl' => $notification->action_url,
                ];
            })->values(),
            'importantNotice' => [
                'title' => $pendingApplications->isNotEmpty() ? 'Candidatures en attente' : 'Centre de notification',
                'message' => $pendingApplications->isNotEmpty()
                    ? 'Traitez les nouvelles demandes pour garder le flux des inscriptions a jour.'
                    : 'Aucune action urgente. Les prochaines notifications administratives apparaitront ici.',
                'actionLabel' => $pendingApplications->isNotEmpty() ? 'Voir les candidatures' : 'Retour au dashboard',
                'actionUrl' => $pendingApplications->isNotEmpty()
                    ? route('admin.applications', absolute: false)
                    : route('admin.dashboard', absolute: false),
            ],
            'pendingApplications' => $pendingApplications,
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

    private function adminCategory(?string $category): string
    {
        return match ($category) {
            'application', 'admission', 'access' => 'application',
            'financial', 'payment', 'invoice' => 'financial',
            'academic', 'schedule', 'course' => 'schedule',
            default => 'system',
        };
    }
}
