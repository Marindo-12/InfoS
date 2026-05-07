<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    /**
     * Redirect to Google OAuth provider.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle callback from Google OAuth provider.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $email = $googleUser->getEmail();

            $user = User::where('email', $email)->first();

            if (! $user) {
                return redirect()->route('login')->with(
                    'error',
                    "Aucun compte etudiant n'est associe a cette adresse Google. Veuillez d'abord envoyer une demande d'inscription."
                );
            }

            if ($user->status !== 'active') {
                return redirect()->route('login')->with(
                    'error',
                    "Votre compte existe, mais il n'est pas encore valide par l'administration."
                );
            }

            if (! $user->google_id) {
                $user->forceFill(['google_id' => $googleUser->getId()])->save();
            }

            Auth::login($user, remember: true);
            request()->session()->regenerate();

            if ($user->isStudent()) {
                request()->session()->put('login_code_verified', true);
            }

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (Throwable $exception) {
            $message = $exception->getMessage();

            Log::error('Google OAuth Error: '.$message, [
                'exception' => $exception::class,
            ]);

            if (Str::contains($message, ['Could not resolve host', 'Could not connect', 'cURL error 6', 'cURL error 7'])) {
                return redirect()->route('login')->with(
                    'error',
                    "Le serveur n'arrive pas a contacter Google pour terminer la connexion. Redemarrez Laravel hors sandbox ou verifiez l'acces internet du serveur."
                );
            }

            return redirect()->route('login')->with(
                'error',
                "L'authentification Google a echoue. Veuillez reessayer."
            );
        }
    }
}
