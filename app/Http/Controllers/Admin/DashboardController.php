<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\EnrollmentApplication;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = now();
        $currentMonth = [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()];
        $previousMonth = [$now->copy()->subMonthNoOverflow()->startOfMonth(), $now->copy()->subMonthNoOverflow()->endOfMonth()];

        $totalStudents = User::query()->where('role', 'student')->count();
        $activeEnrollments = Enrollment::query()->where('status', 'active')->count();
        $newStudentsThisMonth = User::query()
            ->where('role', 'student')
            ->whereBetween('created_at', $currentMonth)
            ->count();

        $applicationsTotal = EnrollmentApplication::query()->count();
        $approvedApplications = EnrollmentApplication::query()->where('status', 'approved')->count();
        $pendingApplications = EnrollmentApplication::query()->where('status', 'pending')->count();
        $currentApprovedApplications = EnrollmentApplication::query()
            ->where('status', 'approved')
            ->whereBetween('approved_at', $currentMonth)
            ->count();
        $previousApprovedApplications = EnrollmentApplication::query()
            ->where('status', 'approved')
            ->whereBetween('approved_at', $previousMonth)
            ->count();

        $monthlyRevenue = $this->paidPaymentsBetween($currentMonth[0], $currentMonth[1]);
        $previousMonthlyRevenue = $this->paidPaymentsBetween($previousMonth[0], $previousMonth[1]);
        $totalCollected = (float) Payment::query()->where('status', 'paid')->sum('amount');
        $pendingPayments = (float) Payment::query()->where('status', 'pending')->sum('amount');
        $openInstallments = PaymentInstallment::query()->where('status', 'pending')->count();

        $totalExpected = (float) Enrollment::query()
            ->with('course:id,price')
            ->get()
            ->sum(fn (Enrollment $enrollment) => (float) ($enrollment->course?->price ?? 0));

        $collectionRate = $totalExpected > 0 ? (int) round(($totalCollected / $totalExpected) * 100) : 0;
        $conversionRate = $applicationsTotal > 0 ? round(($approvedApplications / $applicationsTotal) * 100, 1) : 0;
        $conversionCurrent = $this->conversionForPeriod($currentMonth[0], $currentMonth[1]);
        $conversionPrevious = $this->conversionForPeriod($previousMonth[0], $previousMonth[1]);

        $enrollmentDistribution = $this->enrollmentDistribution();
        $financialDistribution = $this->financialDistribution($totalExpected, $totalCollected, $pendingPayments);

        return Inertia::render('Dashboard/Admin/Dashboard', [
            'stats' => [
                [
                    'label' => 'Total Etudiants',
                    'value' => number_format($totalStudents, 0, ',', ' '),
                    'sub' => $activeEnrollments.' inscription(s) active(s)',
                    'delta' => $newStudentsThisMonth > 0 ? '+'.$newStudentsThisMonth.' ce mois' : 'stable ce mois',
                    'accent' => 'orange',
                ],
                [
                    'label' => 'Revenu Mensuel',
                    'value' => number_format($monthlyRevenue, 0, ',', ' ').' DH',
                    'sub' => number_format($totalCollected, 0, ',', ' ').' DH encaisses au total',
                    'delta' => $this->moneyDelta($monthlyRevenue, $previousMonthlyRevenue),
                    'accent' => 'green',
                ],
                [
                    'label' => 'Taux de Conversion',
                    'value' => $conversionRate.'%',
                    'sub' => $approvedApplications.' dossier(s) approuve(s)',
                    'delta' => $this->percentDelta($conversionCurrent, $conversionPrevious),
                    'accent' => 'tertiary',
                ],
                [
                    'label' => 'Candidatures',
                    'value' => number_format($pendingApplications, 0, ',', ' '),
                    'sub' => 'dossier(s) a traiter',
                    'delta' => $openInstallments.' echeance(s) ouvertes',
                    'accent' => 'slate',
                ],
            ],
            'summary' => [
                'students' => $totalStudents,
                'monthlyRevenue' => $monthlyRevenue,
                'totalCollected' => $totalCollected,
                'pendingApplications' => $pendingApplications,
                'collectionRate' => $collectionRate,
                'conversionRate' => $conversionRate,
                'applicationsTotal' => $applicationsTotal,
                'enrollmentsTotal' => $activeEnrollments,
            ],
            'enrollmentDistribution' => $enrollmentDistribution,
            'financialDistribution' => $financialDistribution,
            'recentActivity' => $this->recentActivity(),
            'spotlight' => [
                'students' => $activeEnrollments.' inscriptions actives a suivre',
                'courses' => $enrollmentDistribution->count().' categorie(s) representee(s)',
                'reports' => $collectionRate.'% de recouvrement global',
            ],
        ]);
    }

    public function reports(Request $request): Response
    {
        $now = now();
        $availableYears = $this->availableReportYears();
        $selectedYear = (int) $request->integer('year', $now->year);

        if (! in_array($selectedYear, $availableYears, true)) {
            $selectedYear = $availableYears[0] ?? $now->year;
        }

        $yearStart = Carbon::create($selectedYear, 1, 1)->startOfDay();
        $yearEnd = Carbon::create($selectedYear, 12, 31)->endOfDay();
        $previousStart = $yearStart->copy()->subYear();
        $previousEnd = $yearEnd->copy()->subYear();

        $annualRevenue = $this->paidPaymentsBetween($yearStart, $yearEnd);
        $previousRevenue = $this->paidPaymentsBetween($previousStart, $previousEnd);
        $yearEnrollments = $this->enrollmentsBetween($yearStart, $yearEnd);
        $yearApplications = EnrollmentApplication::query()->whereBetween('created_at', [$yearStart, $yearEnd])->count();
        $approvedApplications = EnrollmentApplication::query()
            ->where('status', 'approved')
            ->whereBetween('created_at', [$yearStart, $yearEnd])
            ->count();
        $certificates = EnrollmentApplication::query()
            ->whereNotNull('certificate_reference')
            ->whereBetween('created_at', [$yearStart, $yearEnd])
            ->count();

        $activeEnrollments = Enrollment::query()->where('status', 'active')->count();
        $completedEnrollments = Enrollment::query()
            ->where(function ($query) {
                $query->where('status', 'completed')->orWhere('progress', '>=', 100);
            })
            ->whereBetween(DB::raw('COALESCE(enrolled_at, created_at)'), [$yearStart, $yearEnd])
            ->count();
        $completionRate = $yearEnrollments > 0 ? (int) round(($completedEnrollments / $yearEnrollments) * 100) : 0;
        $approvalRate = $yearApplications > 0 ? (int) round(($approvedApplications / $yearApplications) * 100) : 0;

        $totalExpected = (float) Enrollment::query()
            ->with('course:id,price')
            ->whereBetween(DB::raw('COALESCE(enrolled_at, created_at)'), [$yearStart, $yearEnd])
            ->get()
            ->sum(fn (Enrollment $enrollment) => (float) ($enrollment->course?->price ?? 0));

        $pendingPayments = (float) Payment::query()
            ->where('status', 'pending')
            ->whereBetween('created_at', [$yearStart, $yearEnd])
            ->sum('amount');

        return Inertia::render('Dashboard/Admin/Reports', [
            'filters' => [
                'year' => $selectedYear,
                'availableYears' => $availableYears,
            ],
            'metrics' => [
                'annualRevenue' => $annualRevenue,
                'revenueGrowth' => $this->growthPercent($annualRevenue, $previousRevenue),
                'yearEnrollments' => $yearEnrollments,
                'activeEnrollments' => $activeEnrollments,
                'certificates' => $certificates,
                'completionRate' => $completionRate,
                'approvalRate' => $approvalRate,
            ],
            'monthlyPerformance' => $this->monthlyReportPerformance($selectedYear),
            'categoryDistribution' => $this->categoryDistributionForYear($yearStart, $yearEnd),
            'financialStatus' => $this->financialStatusForYear($totalExpected, $annualRevenue, $pendingPayments),
            'applicationStatus' => $this->applicationStatusForYear($yearStart, $yearEnd),
            'historicalComparison' => $this->historicalComparison($availableYears),
            'courseLeaders' => $this->courseLeadersForYear($yearStart, $yearEnd),
        ]);
    }

    private function paidPaymentsBetween(Carbon $start, Carbon $end): float
    {
        return (float) Payment::query()
            ->where('status', 'paid')
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('paid_at', [$start, $end])
                    ->orWhere(function ($nested) use ($start, $end) {
                        $nested->whereNull('paid_at')->whereBetween('created_at', [$start, $end]);
                    });
            })
            ->sum('amount');
    }

    private function enrollmentsBetween(Carbon $start, Carbon $end): int
    {
        return Enrollment::query()
            ->whereBetween(DB::raw('COALESCE(enrolled_at, created_at)'), [$start, $end])
            ->count();
    }

    private function availableReportYears(): array
    {
        $years = collect([
            now()->year,
            ...Payment::query()
                ->selectRaw("EXTRACT(YEAR FROM COALESCE(paid_at, created_at))::int as year")
                ->distinct()
                ->pluck('year')
                ->all(),
            ...Enrollment::query()
                ->selectRaw("EXTRACT(YEAR FROM COALESCE(enrolled_at, created_at))::int as year")
                ->distinct()
                ->pluck('year')
                ->all(),
            ...EnrollmentApplication::query()
                ->selectRaw('EXTRACT(YEAR FROM created_at)::int as year')
                ->distinct()
                ->pluck('year')
                ->all(),
        ]);

        return $years
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->unique()
            ->sortDesc()
            ->values()
            ->all();
    }

    private function monthlyReportPerformance(int $year)
    {
        $labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];

        return collect(range(1, 12))->map(function (int $month) use ($year, $labels) {
            $start = Carbon::create($year, $month, 1)->startOfMonth();
            $end = $start->copy()->endOfMonth();

            return [
                'month' => $labels[$month - 1],
                'revenue' => $this->paidPaymentsBetween($start, $end),
                'applications' => EnrollmentApplication::query()->whereBetween('created_at', [$start, $end])->count(),
                'enrollments' => $this->enrollmentsBetween($start, $end),
            ];
        })->values();
    }

    private function categoryDistributionForYear(Carbon $start, Carbon $end)
    {
        $colors = ['#c2652a', '#8c3c3c', '#78706a', '#e08850', '#605850', '#d47070'];

        $distribution = Enrollment::query()
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->select('courses.category as category', DB::raw('COUNT(*) as total'))
            ->whereBetween(DB::raw('COALESCE(enrollments.enrolled_at, enrollments.created_at)'), [$start, $end])
            ->groupBy('courses.category')
            ->orderByDesc('total')
            ->get();

        if ($distribution->isEmpty()) {
            $distribution = EnrollmentApplication::query()
                ->select('category', DB::raw('COUNT(*) as total'))
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('category')
                ->orderByDesc('total')
                ->get();
        }

        return $distribution->values()->map(fn ($row, int $index) => [
            'name' => $this->categoryLabel($row->category),
            'value' => (int) $row->total,
            'color' => $colors[$index % count($colors)],
        ]);
    }

    private function financialStatusForYear(float $expected, float $collected, float $pending)
    {
        $remaining = max($expected - $collected - $pending, 0);

        return collect([
            ['name' => 'Encaisse', 'value' => $collected, 'color' => '#c2652a'],
            ['name' => 'En attente', 'value' => $pending, 'color' => '#8c3c3c'],
            ['name' => 'Reste estime', 'value' => $remaining, 'color' => '#78706a'],
        ])->filter(fn ($item) => $item['value'] > 0)->values();
    }

    private function applicationStatusForYear(Carbon $start, Carbon $end)
    {
        $colors = [
            'approved' => '#c2652a',
            'pending' => '#8c3c3c',
            'rejected' => '#78706a',
        ];

        return EnrollmentApplication::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('status')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'name' => match ($row->status) {
                    'approved' => 'Validees',
                    'rejected' => 'Rejetees',
                    default => 'En attente',
                },
                'value' => (int) $row->total,
                'color' => $colors[$row->status] ?? '#605850',
            ])
            ->values();
    }

    private function historicalComparison(array $years)
    {
        return collect($years)
            ->take(4)
            ->map(function (int $year) {
                $start = Carbon::create($year, 1, 1)->startOfDay();
                $end = Carbon::create($year, 12, 31)->endOfDay();
                $revenue = $this->paidPaymentsBetween($start, $end);
                $applications = EnrollmentApplication::query()->whereBetween('created_at', [$start, $end])->count();
                $approved = EnrollmentApplication::query()
                    ->where('status', 'approved')
                    ->whereBetween('created_at', [$start, $end])
                    ->count();
                $enrollments = $this->enrollmentsBetween($start, $end);
                $certificates = EnrollmentApplication::query()
                    ->whereNotNull('certificate_reference')
                    ->whereBetween('created_at', [$start, $end])
                    ->count();

                return [
                    'year' => $year,
                    'revenue' => $revenue,
                    'monthlyAverage' => round($revenue / 12),
                    'students' => $enrollments,
                    'certificates' => $certificates,
                    'approvalRate' => $applications > 0 ? (int) round(($approved / $applications) * 100) : 0,
                ];
            })
            ->values();
    }

    private function courseLeadersForYear(Carbon $start, Carbon $end)
    {
        return Course::query()
            ->leftJoin('enrollments', 'courses.id', '=', 'enrollments.course_id')
            ->select('courses.title', 'courses.category', DB::raw('COUNT(enrollments.id) as total'))
            ->where(function ($query) use ($start, $end) {
                $query->whereNull('enrollments.id')
                    ->orWhereBetween(DB::raw('COALESCE(enrollments.enrolled_at, enrollments.created_at)'), [$start, $end]);
            })
            ->groupBy('courses.id', 'courses.title', 'courses.category')
            ->orderByDesc('total')
            ->take(5)
            ->get()
            ->map(fn (Course $course) => [
                'title' => $course->title,
                'category' => $this->categoryLabel($course->category),
                'enrollments' => (int) $course->total,
            ]);
    }

    private function conversionForPeriod(Carbon $start, Carbon $end): float
    {
        $total = EnrollmentApplication::query()->whereBetween('created_at', [$start, $end])->count();
        $approved = EnrollmentApplication::query()
            ->where('status', 'approved')
            ->whereBetween('created_at', [$start, $end])
            ->count();

        return $total > 0 ? round(($approved / $total) * 100, 1) : 0;
    }

    private function enrollmentDistribution()
    {
        $colors = ['#c2652a', '#8c3c3c', '#78706a', '#e08850', '#605850', '#d47070'];

        $distribution = Enrollment::query()
            ->join('courses', 'courses.id', '=', 'enrollments.course_id')
            ->select('courses.category as category', DB::raw('COUNT(*) as total'))
            ->where('enrollments.status', 'active')
            ->groupBy('courses.category')
            ->orderByDesc('total')
            ->get();

        if ($distribution->isEmpty()) {
            $distribution = EnrollmentApplication::query()
                ->select('category', DB::raw('COUNT(*) as total'))
                ->groupBy('category')
                ->orderByDesc('total')
                ->get();
        }

        return $distribution->values()->map(fn ($row, int $index) => [
            'name' => $this->categoryLabel($row->category),
            'value' => (int) $row->total,
            'color' => $colors[$index % count($colors)],
        ]);
    }

    private function financialDistribution(float $expected, float $collected, float $pendingPayments)
    {
        $remaining = max($expected - $collected - $pendingPayments, 0);

        return collect([
            ['name' => 'Encaisse', 'value' => $collected, 'color' => '#c2652a'],
            ['name' => 'En attente', 'value' => $pendingPayments, 'color' => '#8c3c3c'],
            ['name' => 'Reste estime', 'value' => $remaining, 'color' => '#78706a'],
        ])->filter(fn ($item) => $item['value'] > 0)->values();
    }

    private function recentActivity()
    {
        $applications = EnrollmentApplication::query()
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (EnrollmentApplication $application) => [
                'title' => $application->status === 'approved' ? 'Candidature approuvee' : 'Nouvelle candidature',
                'description' => trim($application->first_name.' '.$application->last_name).' - '.($application->training_label ?: $this->categoryLabel($application->category)),
                'time' => optional($application->created_at)->diffForHumans(),
                'icon' => $application->status === 'approved' ? 'verified_user' : 'person_add',
                'tone' => $application->status === 'approved' ? 'primary' : 'tertiary',
                'timestamp' => optional($application->created_at)->timestamp ?? 0,
            ]);

        $payments = Payment::query()
            ->with(['enrollment.user', 'enrollment.course'])
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Payment $payment) => [
                'title' => $payment->status === 'paid' ? 'Paiement recu' : 'Paiement en attente',
                'description' => ($payment->enrollment?->user?->name ?? 'Etudiant').' - '.number_format((float) $payment->amount, 0, ',', ' ').' DH',
                'time' => optional($payment->paid_at ?? $payment->created_at)->diffForHumans(),
                'icon' => $payment->status === 'paid' ? 'payments' : 'pending_actions',
                'tone' => $payment->status === 'paid' ? 'secondary' : 'warning',
                'timestamp' => optional($payment->paid_at ?? $payment->created_at)->timestamp ?? 0,
            ]);

        return $applications
            ->merge($payments)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->map(fn ($item) => collect($item)->except('timestamp')->all());
    }

    private function categoryLabel(?string $category): string
    {
        return match ($category) {
            'langues' => 'Langues',
            'bureautique' => 'Bureautique',
            'concours' => 'Concours',
            'infographie' => 'Infographie',
            default => Str::of($category ?: 'Autres')->replace(['-', '_'], ' ')->title()->toString(),
        };
    }

    private function moneyDelta(float $current, float $previous): string
    {
        $difference = $current - $previous;

        if ($difference === 0.0) {
            return '0 DH';
        }

        return ($difference > 0 ? '+' : '-').number_format(abs($difference), 0, ',', ' ').' DH';
    }

    private function percentDelta(float $current, float $previous): string
    {
        if ($previous <= 0) {
            return $current > 0 ? '+'.$current.'%' : '0%';
        }

        $difference = round($current - $previous, 1);

        return ($difference > 0 ? '+' : '').$difference.'%';
    }

    private function growthPercent(float $current, float $previous): float
    {
        if ($previous <= 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
