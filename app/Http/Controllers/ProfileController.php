<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Enrollment;
use App\Models\EnrollmentApplication;
use App\Models\Payment;
use App\Models\PortalNotification;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'profileSummary' => $this->profileSummary($user),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    private function profileSummary(User $user): array
    {
        if ($user->isAdmin()) {
            $collected = (float) Payment::query()->where('status', 'paid')->sum('amount');

            return [
                ['label' => 'Role', 'value' => 'Admin', 'sub' => 'Acces complet'],
                ['label' => 'Etudiants', 'value' => number_format(User::query()->where('role', 'student')->count(), 0, ',', ' '), 'sub' => 'Comptes inscrits'],
                ['label' => 'Candidatures', 'value' => number_format(EnrollmentApplication::query()->where('status', 'pending')->count(), 0, ',', ' '), 'sub' => 'En attente'],
                ['label' => 'Encaisse', 'value' => number_format($collected, 0, ',', ' ').' DH', 'sub' => 'Paiements valides'],
                ['label' => 'Notifications', 'value' => number_format(PortalNotification::query()->where('user_id', $user->id)->whereNull('read_at')->count(), 0, ',', ' '), 'sub' => 'Non lues'],
            ];
        }

        $enrollments = Enrollment::query()->where('user_id', $user->id);

        return [
            ['label' => 'Role', 'value' => 'Etudiant', 'sub' => 'Espace personnel'],
            ['label' => 'Formations', 'value' => number_format((clone $enrollments)->count(), 0, ',', ' '), 'sub' => 'Inscriptions'],
            ['label' => 'Actives', 'value' => number_format((clone $enrollments)->where('status', 'active')->count(), 0, ',', ' '), 'sub' => 'En cours'],
            ['label' => 'Notifications', 'value' => number_format(PortalNotification::query()->where('user_id', $user->id)->whereNull('read_at')->count(), 0, ',', ' '), 'sub' => 'Non lues'],
        ];
    }
}
