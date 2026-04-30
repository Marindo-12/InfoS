<?php

namespace App\Http\Middleware;

use App\Models\EnrollmentApplication;
use App\Models\PortalNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'status' => fn () => $request->session()->get('status'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'adminHeader' => fn () => $this->adminHeaderData($request),
        ];
    }

    private function adminHeaderData(Request $request): array
    {
        $user = $request->user();

        if (! $user?->isAdmin()) {
            return [
                'unreadNotifications' => 0,
                'pendingApplications' => 0,
                'recentNotifications' => [],
            ];
        }

        $hasNotifications = Schema::hasTable('portal_notifications');
        $hasApplications = Schema::hasTable('enrollment_applications');

        return [
            'unreadNotifications' => $hasNotifications
                ? PortalNotification::query()->where('user_id', $user->id)->whereNull('read_at')->count()
                : 0,
            'pendingApplications' => $hasApplications
                ? EnrollmentApplication::query()->where('status', 'pending')->count()
                : 0,
            'recentNotifications' => $hasNotifications
                ? PortalNotification::query()
                    ->where('user_id', $user->id)
                    ->latest('published_at')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(fn (PortalNotification $notification) => [
                        'id' => $notification->id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'actionLabel' => $notification->action_label,
                        'actionUrl' => $notification->action_url,
                        'isRead' => $notification->read_at !== null,
                        'publishedAt' => optional($notification->published_at ?? $notification->created_at)->diffForHumans(),
                    ])
                    ->values()
                : [],
        ];
    }
}
