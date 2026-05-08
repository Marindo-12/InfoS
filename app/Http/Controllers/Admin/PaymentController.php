<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        $payments = Payment::query()
            ->with(['enrollment.user', 'enrollment.course', 'enrollment.payments'])
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at')
            ->get();

        $installments = PaymentInstallment::query()
            ->with(['enrollment.user', 'enrollment.course'])
            ->orderBy('due_date')
            ->get();

        $enrollments = Enrollment::query()
            ->with(['user', 'course'])
            ->get();

        $totalExpected = (float) $enrollments->sum(fn (Enrollment $enrollment) => (float) ($enrollment->course?->price ?? 0));
        $totalCollected = (float) $payments->where('status', 'paid')->sum('amount');
        $pendingAmount = max($totalExpected - $totalCollected, 0);
        $paidPayments = $payments->where('status', 'paid');
        $pendingPayments = $payments->where('status', 'pending');
        $completion = $totalExpected > 0 ? (int) round(($totalCollected / $totalExpected) * 100) : 0;

        $stats = [
            [
                'label' => 'Total Encaissements',
                'value' => number_format($totalCollected, 0, ',', ' ').' DH',
                'sub' => 'encaissements confirms',
                'accent' => 'green',
            ],
            [
                'label' => 'Restes a percevoir',
                'value' => number_format($pendingAmount, 0, ',', ' ').' DH',
                'sub' => $installments->where('status', 'pending')->count().' echeance(s) encore ouvertes',
                'accent' => 'orange',
            ],
            [
                'label' => 'Paiements en attente',
                'value' => number_format($pendingPayments->count(), 0, ',', ' '),
                'sub' => 'operations non finalisees',
                'accent' => 'slate',
            ],
            [
                'label' => 'Taux de recouvrement',
                'value' => $completion.'%',
                'sub' => 'sur l ensemble des inscriptions',
                'accent' => 'blue',
            ],
        ];

        $monthLabels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
        $monthlyRevenue = collect(range(1, 12))
            ->map(function (int $month) use ($monthLabels) {
                $start = Carbon::create(now()->year, $month, 1)->startOfMonth();
                $end = $start->copy()->endOfMonth();
                $group = Payment::query()
                    ->where(function ($query) use ($start, $end) {
                        $query->whereBetween('paid_at', [$start, $end])
                            ->orWhere(function ($nested) use ($start, $end) {
                                $nested->whereNull('paid_at')->whereBetween('created_at', [$start, $end]);
                            });
                    })
                    ->get();

                return [
                    'month' => $monthLabels[$month - 1],
                    'collected' => (float) $group->where('status', 'paid')->sum('amount'),
                    'pending' => (float) $group->where('status', 'pending')->sum('amount'),
                ];
            })
            ->values();

        $statusDistribution = [
            [
                'name' => 'Regle',
                'value' => (float) $paidPayments->sum('amount'),
                'color' => '#c2652a',
            ],
            [
                'name' => 'En attente',
                'value' => (float) $pendingPayments->sum('amount'),
                'color' => '#8c3c3c',
            ],
            [
                'name' => 'A encaisser',
                'value' => max($pendingAmount - (float) $pendingPayments->sum('amount'), 0),
                'color' => '#d8d0c8',
            ],
        ];

        $recentPayments = $payments
            ->take(6)
            ->values()
            ->map(function (Payment $payment) {
                return [
                    'reference' => $payment->reference,
                    'student' => $payment->enrollment->user->name,
                    'course' => $payment->enrollment->course->title,
                    'method' => match ($payment->method) {
                        'bank_transfer' => 'Virement bancaire',
                        'cash' => 'Especes',
                        'card' => 'Carte bancaire',
                        default => ucfirst(str_replace('_', ' ', $payment->method)),
                    },
                    'amount' => number_format((float) $payment->amount, 2, ',', ' ').' DH',
                    'status' => $payment->status,
                    'date' => optional($payment->paid_at ?? $payment->created_at)->format('d/m/Y'),
                ];
            });

        $paymentRows = $payments->map(function (Payment $payment) {
            $coursePrice = (float) ($payment->enrollment->course?->price ?? 0);
            $studentPaid = (float) $payment->enrollment->payments->where('status', 'paid')->sum('amount');
            $studentRemaining = max($coursePrice - $studentPaid, 0);

            return [
                'reference' => $payment->reference,
                'student' => $payment->enrollment->user->name,
                'email' => $payment->enrollment->user->email,
                'course' => $payment->enrollment->course->title,
                'method' => match ($payment->method) {
                    'bank_transfer' => 'Virement',
                    'cash' => 'Especes',
                    'card' => 'Carte',
                    default => ucfirst(str_replace('_', ' ', $payment->method)),
                },
                'amount' => number_format((float) $payment->amount, 2, ',', ' ').' DH',
                'status' => $payment->status,
                'date' => optional($payment->paid_at ?? $payment->created_at)->format('d/m/Y'),
                'remaining' => number_format($studentRemaining, 2, ',', ' ').' DH',
            ];
        })->values();

        $upcomingInstallments = $installments
            ->where('status', 'pending')
            ->take(5)
            ->values()
            ->map(function (PaymentInstallment $installment) {
                return [
                    'student' => $installment->enrollment->user->name,
                    'course' => $installment->enrollment->course->title,
                    'title' => $installment->title,
                    'amount' => number_format((float) $installment->amount, 0, ',', ' ').' DH',
                    'dueDate' => optional($installment->due_date)->format('d/m/Y'),
                ];
            });

        return Inertia::render('Dashboard/Admin/Payments', [
            'stats' => $stats,
            'summary' => [
                'totalExpected' => number_format($totalExpected, 0, ',', ' ').' DH',
                'totalCollected' => number_format($totalCollected, 0, ',', ' ').' DH',
                'completion' => $completion,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'statusDistribution' => $statusDistribution,
            'recentPayments' => $recentPayments,
            'payments' => $paymentRows,
            'upcomingInstallments' => $upcomingInstallments,
        ]);
    }
}
