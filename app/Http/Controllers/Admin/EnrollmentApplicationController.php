<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\EnrollmentApplication;
use App\Models\Payment;
use App\Models\PortalNotification;
use App\Support\EnrollmentAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentApplicationController extends Controller
{
    public function index(): Response
    {
        $applications = EnrollmentApplication::query()
            ->with(['course', 'user'])
            ->latest()
            ->get()
            ->map(fn (EnrollmentApplication $application) => [
                'id' => $application->id,
                'reference' => $application->reference,
                'student' => trim($application->first_name.' '.$application->last_name),
                'email' => $application->email,
                'phone' => $application->phone,
                'course' => $application->course?->title ?? $application->training_label,
                'category' => $application->category,
                'amount' => number_format((float) $application->amount, 0, ',', ' ').' DH',
                'paymentMethod' => $application->payment_method,
                'paymentStatus' => $application->payment_status,
                'preferredPaymentDate' => optional($application->preferred_payment_date)->format('d/m/Y'),
                'certificateReference' => $application->certificate_reference,
                'status' => $application->status,
                'createdAt' => optional($application->created_at)->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Dashboard/Admin/Applications', [
            'applications' => $applications,
            'stats' => [
                'pending' => $applications->where('status', 'pending')->count(),
                'approved' => $applications->where('status', 'approved')->count(),
                'onlinePaid' => $applications->where('paymentMethod', 'online')->where('paymentStatus', 'paid')->count(),
                'onsitePending' => $applications->where('paymentMethod', 'onsite')->where('paymentStatus', 'pending')->count(),
            ],
        ]);
    }

    public function approve(Request $request, EnrollmentApplication $application): RedirectResponse
    {
        if ($application->status === 'approved') {
            return back()->with('success', 'Cette demande est deja validee.');
        }

        DB::transaction(function () use ($request, $application) {
            $course = $application->course ?: Course::query()
                ->where('category', $application->category)
                ->where('status', 'active')
                ->first()
                ?: Course::create([
                    'title' => $application->training_label,
                    'slug' => Str::slug($application->category.'-'.$application->training_label.'-'.Str::random(5)),
                    'category' => $application->category,
                    'price' => $application->amount,
                    'status' => 'active',
                ]);

            $user = $application->user;
            $plainPassword = EnrollmentAccess::generatedPassword($application->first_name, $application->last_name);

            $user->forceFill([
                'name' => trim($application->first_name.' '.$application->last_name),
                'email' => $application->email,
                'phone' => $application->phone,
                'role' => 'student',
                'status' => 'active',
                'email_verified_at' => now(),
                'password' => Hash::make($plainPassword),
            ])->save();

            $enrollment = Enrollment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $course?->id,
                ],
                [
                    'reference' => 'ENR-'.now()->format('Ymd').'-'.Str::upper(Str::random(5)),
                    'group_name' => null,
                    'room' => null,
                    'progress' => 0,
                    'status' => 'active',
                    'payment_status' => $application->payment_status === 'paid' ? 'paid' : 'pending',
                    'enrolled_at' => now(),
                    'next_session_at' => $course?->starts_at,
                ],
            );

            Payment::updateOrCreate(
                ['reference' => $application->payment_reference ?: 'PAY-'.$application->reference],
                [
                    'enrollment_id' => $enrollment->id,
                    'method' => $application->payment_method === 'online' ? 'card' : 'cash',
                    'amount' => $application->amount,
                    'status' => $application->payment_status === 'paid' ? 'paid' : 'pending',
                    'paid_at' => $application->payment_status === 'paid' ? now() : null,
                    'notes' => $application->payment_method === 'onsite'
                        ? 'Paiement presentiel prevu le '.optional($application->preferred_payment_date)->format('d/m/Y')
                        : 'Paiement en ligne confirme avant validation admin.',
                ],
            );

            $application->forceFill([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => $request->user()->id,
            ])->save();

            PortalNotification::create([
                'user_id' => $user->id,
                'category' => 'access',
                'title' => 'Acces etudiant active',
                'message' => 'Votre compte est actif. Connectez-vous avec votre email et le mot de passe envoye par email.',
                'icon' => 'verified_user',
                'action_label' => 'Se connecter',
                'action_url' => route('login', absolute: false),
                'published_at' => now(),
            ]);

            Mail::raw(
                "Bonjour {$user->name},\n\nVotre acces Info Saloua est active.\nEmail: {$user->email}\nMot de passe: {$plainPassword}\n\nLors de la connexion, un code de verification vous sera envoye par email avant l acces au dashboard.",
                fn ($message) => $message->to($user->email)->subject('Votre acces etudiant Info Saloua'),
            );
        });

        return back()->with('success', 'Compte etudiant active et identifiants envoyes.');
    }
}
