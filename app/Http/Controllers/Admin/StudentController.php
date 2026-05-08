<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        $students = User::query()
            ->where('role', 'student')
            ->with(['enrollments.course', 'enrollments.payments'])
            ->orderByDesc('created_at')
            ->get();

        $totalRevenue = (float) Payment::query()
            ->where('status', 'paid')
            ->sum('amount');

        $stats = [
            [
                'label' => 'Total etudiants',
                'value' => number_format($students->count(), 0, ',', ' '),
                'sub' => 'comptes etudiants actifs',
                'accent' => 'orange',
            ],
            [
                'label' => 'Nouveaux inscrits',
                'value' => number_format($students->where('created_at', '>=', now()->subDays(30))->count(), 0, ',', ' '),
                'sub' => 'sur les 30 derniers jours',
                'accent' => 'blue',
            ],
            [
                'label' => 'Revenu encaisse',
                'value' => number_format($totalRevenue, 0, ',', ' ').' DH',
                'sub' => 'paiements confirmes',
                'accent' => 'green',
            ],
            [
                'label' => 'Formations actives',
                'value' => number_format(Course::query()->where('status', 'active')->count(), 0, ',', ' '),
                'sub' => 'catalogue actuellement ouvert',
                'accent' => 'slate',
            ],
        ];

        $recentStudents = $students
            ->take(4)
            ->values()
            ->map(function (User $student) {
                $latestEnrollment = $student->enrollments->sortByDesc('created_at')->first();

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'phone' => $student->phone,
                    'city' => $student->city,
                    'status' => $student->status,
                    'avatarUrl' => $student->avatar_url,
                    'course' => $latestEnrollment?->course?->title ?? 'Aucune formation',
                    'joinedAt' => $student->created_at?->format('d/m/Y'),
                    'progress' => $latestEnrollment?->progress ?? 0,
                ];
            });

        $studentRows = $students->map(function (User $student) {
            $latestEnrollment = $student->enrollments->sortByDesc('created_at')->first();
            $paidTotal = (float) $student->enrollments
                ->flatMap->payments
                ->where('status', 'paid')
                ->sum('amount');
            $dueTotal = (float) $student->enrollments->sum(fn (Enrollment $enrollment) => (float) ($enrollment->course?->price ?? 0));

            $paymentStatus = match (true) {
                $dueTotal <= 0 => 'non defini',
                $paidTotal >= $dueTotal => 'paye',
                $paidTotal > 0 => 'partiel',
                default => 'retard',
            };

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'address' => $student->address,
                'city' => $student->city,
                'status' => $student->status,
                'joinedAt' => $student->created_at?->format('d/m/Y'),
                'avatarUrl' => $student->avatar_url,
                'course' => $latestEnrollment?->course?->title ?? 'Aucune formation',
                'progress' => $latestEnrollment?->progress ?? 0,
                'paymentStatus' => $paymentStatus,
                'lastSeen' => $student->updated_at?->diffForHumans(),
                'enrollmentsCount' => $student->enrollments->count(),
            ];
        })->values();

        return Inertia::render('Dashboard/Admin/Students', [
            'stats' => $stats,
            'recentStudents' => $recentStudents,
            'students' => $studentRows,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        User::query()->create([
            ...$data,
            'role' => 'student',
            'password' => Hash::make(str()->password(14)),
        ]);

        return back()->with('success', 'Etudiant cree avec succes.');
    }

    public function update(Request $request, User $student): RedirectResponse
    {
        abort_unless($student->isStudent(), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($student->id)],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $student->update($data);

        return back()->with('success', 'Etudiant mis a jour.');
    }

    public function destroy(User $student): RedirectResponse
    {
        abort_unless($student->isStudent(), 404);

        $student->delete();

        return back()->with('success', 'Etudiant supprime.');
    }
}
