<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with(['course', 'payments', 'paymentInstallments'])
            ->where('user_id', $user->id)
            ->get();

        $payments = Payment::query()
            ->whereHas('enrollment', fn ($query) => $query->where('user_id', $user->id))
            ->with('enrollment.course')
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at')
            ->get();

        $installments = PaymentInstallment::query()
            ->whereHas('enrollment', fn ($query) => $query->where('user_id', $user->id))
            ->with('enrollment.course')
            ->orderBy('due_date')
            ->get();

        $totalDue = (float) $enrollments->sum(fn (Enrollment $enrollment) => (float) $enrollment->course->price);
        $totalPaid = (float) $payments->where('status', 'paid')->sum('amount');
        $remaining = max($totalDue - $totalPaid, 0);
        $completion = $totalDue > 0 ? (int) round(($totalPaid / $totalDue) * 100) : 0;
        $nextInstallment = $installments->firstWhere('status', 'pending');

        $stats = [
            [
                'label' => 'Montant deja regle',
                'value' => number_format($totalPaid, 0, ',', ' ').' DH',
                'sub' => 'sur '.number_format($totalDue, 0, ',', ' ').' DH',
                'color' => '#10b981',
                'icon' => 'check',
            ],
            [
                'label' => 'Reste a payer',
                'value' => number_format($remaining, 0, ',', ' ').' DH',
                'sub' => $nextInstallment
                    ? 'prochaine echeance le '.$nextInstallment->due_date?->format('d/m')
                    : 'aucune echeance en attente',
                'color' => '#ff6b2b',
                'icon' => 'wallet',
            ],
            [
                'label' => 'Paiements valides',
                'value' => $payments->where('status', 'paid')->count().' / '.$payments->count(),
                'sub' => $payments->where('status', 'pending')->count().' operation(s) en attente',
                'color' => '#3b82f6',
                'icon' => 'receipt',
            ],
        ];

        $monthly = $installments
            ->groupBy(fn (PaymentInstallment $installment) => optional($installment->due_date)->format('M') ?? 'N/A')
            ->map(function ($group, $month) {
                return [
                    'month' => $month,
                    'expected' => (float) $group->sum('amount'),
                    'paid' => (float) $group->where('status', 'paid')->sum('amount'),
                ];
            })
            ->values();

        $distribution = [
            ['name' => 'Regle', 'value' => $totalPaid, 'color' => '#ff6b2b'],
            ['name' => 'Restant', 'value' => $remaining, 'color' => '#f2d7c7'],
        ];

        $history = $payments->map(function (Payment $payment) {
            return [
                'date' => optional($payment->paid_at ?? $payment->created_at)->format('d M Y'),
                'method' => match ($payment->method) {
                    'bank_transfer' => 'Virement bancaire',
                    'cash' => 'Depot espece',
                    'card' => 'Carte bancaire',
                    default => ucfirst(str_replace('_', ' ', $payment->method)),
                },
                'type' => match ($payment->method) {
                    'bank_transfer' => 'bank',
                    'cash' => 'cash',
                    default => 'card',
                },
                'amount' => number_format((float) $payment->amount, 2, ',', ' ').' DH',
                'status' => $payment->status,
            ];
        })->values();

        $invoiceItems = $enrollments->map(function (Enrollment $enrollment) {
            return [
                'title' => 'Facture - '.$enrollment->course->title,
                'issuedAt' => optional($enrollment->enrolled_at ?? $enrollment->created_at)->format('d/m/Y'),
            ];
        })->values();

        $timeline = $installments->map(function (PaymentInstallment $installment, int $index) use ($nextInstallment) {
            $state = $installment->status === 'paid'
                ? 'paid'
                : (($nextInstallment && $nextInstallment->id === $installment->id) ? 'current' : 'upcoming');

            return [
                'month' => optional($installment->due_date)->locale('fr')->translatedFormat('F') ?? 'A venir',
                'amount' => number_format((float) $installment->amount, 0, ',', ' ').' DH',
                'state' => $index === (count($installments) - 1) && $state !== 'paid' ? 'final' : $state,
            ];
        })->values();

        return Inertia::render('Dashboard/Student/Payment', [
            'stats' => $stats,
            'summary' => [
                'remaining' => number_format($remaining, 2, ',', ' ').' DH',
                'paid' => number_format($totalPaid, 0, ',', ' ').' / '.number_format($totalDue, 0, ',', ' ').' DH',
                'completion' => $completion,
                'nextDueLabel' => $nextInstallment
                    ? 'Echeance : '.$nextInstallment->due_date?->format('d/m/Y')
                    : 'Aucune echeance',
            ],
            'monthlyChart' => $monthly,
            'distributionChart' => $distribution,
            'paymentHistory' => $history,
            'invoices' => $invoiceItems,
            'installments' => $timeline,
        ]);
    }
}
