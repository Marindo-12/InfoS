<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Admin Info Saloua',
            'email' => 'admin@infosaloua.test',
        ]);

        $student = User::factory()->create([
            'name' => 'Sara Bennani',
            'email' => 'student@infosaloua.test',
            'phone' => '+212600000000',
        ]);

        $courses = collect([
            [
                'title' => 'Maitrise Adobe Creative Suite',
                'slug' => 'maitrise-adobe-creative-suite',
                'category' => 'Infographie',
                'level' => 'Intermediaire',
                'description' => 'Parcours pratique sur Photoshop, Illustrator et InDesign.',
                'duration_hours' => 72,
                'duration_weeks' => 12,
                'price' => 4500,
                'capacity' => 20,
                'status' => 'active',
                'starts_at' => now()->subWeeks(3),
                'ends_at' => now()->addWeeks(9),
            ],
            [
                'title' => 'Expertise Microsoft Office',
                'slug' => 'expertise-microsoft-office',
                'category' => 'Bureautique',
                'level' => 'Avance',
                'description' => 'Word, Excel et PowerPoint orientes productivite et entreprise.',
                'duration_hours' => 48,
                'duration_weeks' => 8,
                'price' => 2800,
                'capacity' => 18,
                'status' => 'active',
                'starts_at' => now()->subWeeks(6),
                'ends_at' => now()->addWeeks(2),
            ],
            [
                'title' => 'Anglais des affaires - Niveau B2',
                'slug' => 'anglais-des-affaires-b2',
                'category' => 'Langues',
                'level' => 'B2',
                'description' => 'Communication professionnelle ecrite et orale en anglais.',
                'duration_hours' => 60,
                'duration_weeks' => 10,
                'price' => 3200,
                'capacity' => 16,
                'status' => 'active',
                'starts_at' => now()->subWeeks(2),
                'ends_at' => now()->addWeeks(8),
            ],
        ])->map(fn (array $course) => Course::create($course));

        $enrollments = [
            [
                'course' => $courses[0],
                'group_name' => 'Groupe A2',
                'room' => 'Salle 302',
                'progress' => 68,
                'payment_status' => 'paid',
                'next_session_at' => now()->addDays(2)->setTime(14, 0),
            ],
            [
                'course' => $courses[1],
                'group_name' => 'Lab 1',
                'room' => 'Lab 1',
                'progress' => 92,
                'payment_status' => 'paid',
                'next_session_at' => now()->addDays(4)->setTime(9, 0),
            ],
            [
                'course' => $courses[2],
                'group_name' => 'Lab 4',
                'room' => 'Lab 4',
                'progress' => 45,
                'payment_status' => 'partial',
                'next_session_at' => now()->addDay()->setTime(10, 0),
            ],
        ];

        foreach ($enrollments as $index => $entry) {
            $enrollment = Enrollment::create([
                'user_id' => $student->id,
                'course_id' => $entry['course']->id,
                'reference' => 'ENR-'.Str::padLeft((string) ($index + 1), 4, '0'),
                'group_name' => $entry['group_name'],
                'room' => $entry['room'],
                'progress' => $entry['progress'],
                'status' => 'active',
                'payment_status' => $entry['payment_status'],
                'enrolled_at' => now()->subWeeks($index + 1),
                'next_session_at' => $entry['next_session_at'],
            ]);

            $payments = match ($entry['course']->slug) {
                'maitrise-adobe-creative-suite' => [
                    ['reference' => 'PAY-1001', 'method' => 'card', 'amount' => 2500, 'status' => 'paid', 'paid_at' => now()->subMonths(2)],
                    ['reference' => 'PAY-1002', 'method' => 'bank_transfer', 'amount' => 2000, 'status' => 'paid', 'paid_at' => now()->subMonth()],
                ],
                'expertise-microsoft-office' => [
                    ['reference' => 'PAY-1003', 'method' => 'cash', 'amount' => 2800, 'status' => 'paid', 'paid_at' => now()->subWeeks(3)],
                ],
                default => [
                    ['reference' => 'PAY-1004', 'method' => 'card', 'amount' => 1500, 'status' => 'paid', 'paid_at' => now()->subWeeks(2)],
                    ['reference' => 'PAY-1005', 'method' => 'bank_transfer', 'amount' => 1700, 'status' => 'pending', 'paid_at' => null],
                ],
            };

            foreach ($payments as $payment) {
                Payment::create([
                    'enrollment_id' => $enrollment->id,
                    ...$payment,
                    'notes' => null,
                ]);
            }

            $installments = match ($entry['course']->slug) {
                'anglais-des-affaires-b2' => [
                    ['title' => 'Acompte initial', 'amount' => 1500, 'due_date' => now()->subWeeks(2)->toDateString(), 'status' => 'paid', 'paid_at' => now()->subWeeks(2)],
                    ['title' => 'Deuxieme versement', 'amount' => 1700, 'due_date' => now()->addWeeks(2)->toDateString(), 'status' => 'pending', 'paid_at' => null],
                ],
                default => [
                    ['title' => 'Paiement unique', 'amount' => $entry['course']->price, 'due_date' => now()->subMonth()->toDateString(), 'status' => 'paid', 'paid_at' => now()->subMonth()],
                ],
            };

            foreach ($installments as $installment) {
                PaymentInstallment::create([
                    'enrollment_id' => $enrollment->id,
                    ...$installment,
                ]);
            }
        }
    }
}
