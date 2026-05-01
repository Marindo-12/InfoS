<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoginVerificationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class LoginVerificationCodeController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if ($request->session()->get('login_code_verified')) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('Auth/LoginCode', [
            'email' => $request->user()->email,
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $record = LoginVerificationCode::query()
            ->where('user_id', $request->user()->id)
            ->whereNull('used_at')
            ->where('expires_at', '>=', now())
            ->latest()
            ->first();

        if (! $record || ! Hash::check($validated['code'], $record->code_hash)) {
            return back()->withErrors(['code' => 'Code invalide ou expire.']);
        }

        $record->forceFill(['used_at' => now()])->save();
        $request->session()->put('login_code_verified', true);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
