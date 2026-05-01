<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\LoginVerificationCode;
use App\Support\EmailMessageTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Throwable;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if ($request->user()->isStudent()) {
            $request->session()->forget('login_code_verified');
            $code = (string) random_int(100000, 999999);

            LoginVerificationCode::create([
                'user_id' => $request->user()->id,
                'code_hash' => Hash::make($code),
                'expires_at' => now()->addMinutes(10),
            ]);

            $email = EmailMessageTemplate::render('login_code', [
                'code' => $code,
            ]);

            try {
                Mail::raw(
                    $email['body'],
                    fn ($message) => $message->to($request->user()->email)->subject($email['subject']),
                );
            } catch (Throwable $exception) {
                Log::warning('Impossible d envoyer le code de verification.', [
                    'user_id' => $request->user()->id,
                    'message' => $exception->getMessage(),
                ]);
            }

            return redirect()->route('login-code.create')
                ->with('status', 'Un code de verification a ete envoye a votre email.');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
