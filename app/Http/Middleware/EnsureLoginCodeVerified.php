<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLoginCodeVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isStudent() && ! $request->session()->get('login_code_verified')) {
            return redirect()->route('login-code.create');
        }

        return $next($request);
    }
}
