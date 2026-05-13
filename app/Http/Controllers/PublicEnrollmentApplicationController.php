<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\EnrollmentApplication;
use App\Models\PortalNotification;
use App\Models\User;
use App\Services\StripePaymentService;
use App\Support\EnrollmentAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class PublicEnrollmentApplicationController extends Controller
{
    public function store(Request $request, StripePaymentService $stripe): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:60'],
            'category' => ['required', 'string', 'max:120'],
            'training_label' => ['required', 'string', 'max:190'],
            'course_slug' => ['nullable', 'string', 'max:190'],
            'amount' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'in:online,onsite'],
            'payment_reference' => ['nullable', 'string', 'max:190'],
            'preferred_payment_date' => ['nullable', 'date', 'after_or_equal:today'],
            'certificate_reference' => ['nullable', 'string', 'max:190'],
            'form_data' => ['nullable', 'array'],
        ]);

        if ($validated['payment_method'] === 'online') {
            if (empty($validated['payment_reference'])) {
                return back()->withErrors([
                    'payment_reference' => 'Reference Stripe manquante pour le paiement en ligne.',
                ]);
            }

            try {
                $stripe->assertSucceeded($validated['payment_reference'], (float) $validated['amount']);
            } catch (Throwable $exception) {
                return back()->withErrors([
                    'payment_reference' => 'Le paiement en ligne n a pas ete confirme par Stripe.',
                ]);
            }
        }

        $application = DB::transaction(function () use ($validated) {
            $course = $this->resolveCourse($validated);
            $user = User::firstOrCreate(
                ['email' => Str::lower($validated['email'])],
                [
                    'name' => trim($validated['first_name'].' '.$validated['last_name']),
                    'phone' => $validated['phone'] ?? null,
                    'role' => 'student',
                    'status' => 'pending',
                    'password' => Hash::make(Str::password(32)),
                ],
            );

            if ($user->status !== 'active') {
                $user->forceFill([
                    'name' => trim($validated['first_name'].' '.$validated['last_name']),
                    'phone' => $validated['phone'] ?? $user->phone,
                    'role' => 'student',
                    'status' => 'pending',
                ])->save();
            }

            $application = EnrollmentApplication::create([
                'user_id' => $user->id,
                'course_id' => $course?->id,
                'reference' => 'INS-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => Str::lower($validated['email']),
                'phone' => $validated['phone'] ?? null,
                'category' => $validated['category'],
                'training_label' => $validated['training_label'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'online' ? 'paid' : 'pending',
                'payment_reference' => $validated['payment_reference'] ?? null,
                'preferred_payment_date' => $validated['preferred_payment_date'] ?? null,
                'certificate_reference' => $validated['certificate_reference'] ?? null,
                'status' => 'pending',
                'form_data' => $validated['form_data'] ?? [],
            ]);

            foreach (EnrollmentAccess::adminUsers() as $admin) {
                PortalNotification::create([
                    'user_id' => $admin->id,
                    'category' => 'application',
                    'title' => 'Nouvelle demande d inscription',
                    'message' => $application->first_name.' '.$application->last_name.' a choisi '.$application->training_label.'.',
                    'icon' => 'how_to_reg',
                    'action_label' => 'Voir la demande',
                    'action_url' => route('admin.applications', absolute: false),
                    'published_at' => now(),
                ]);
            }

            return $application;
        });

        return back()->with('success', 'Votre demande '.$application->reference.' a ete envoyee a l administration.');
    }

    private function resolveCourse(array $data): ?Course
    {
        if (! empty($data['course_slug'])) {
            $course = Course::query()->where('slug', $data['course_slug'])->first();
            if ($course) {
                return $course;
            }
        }

        return Course::query()
            ->where('category', $data['category'])
            ->where('status', 'active')
            ->orderByRaw('ABS(price - ?) ASC', [(float) $data['amount']])
            ->first()
            ?: Course::create([
                'title' => $data['training_label'],
                'slug' => Str::slug($data['category'].'-'.$data['training_label'].'-'.Str::random(5)),
                'category' => $data['category'],
                'price' => $data['amount'],
                'status' => 'active',
            ]);
    }
}
