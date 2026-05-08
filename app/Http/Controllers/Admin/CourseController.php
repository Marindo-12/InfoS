<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSession;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::query()
            ->with(['sessions' => fn ($query) => $query->latest('starts_at')->take(3)])
            ->withCount([
                'enrollments',
                'enrollments as active_enrollments_count' => fn ($query) => $query->where('status', 'active'),
                'sessions',
            ])
            ->orderByDesc('created_at')
            ->get();

        $paidRevenue = (float) Payment::query()
            ->where('status', 'paid')
            ->sum('amount');

        $availableSeats = $courses->sum(function (Course $course) {
            if (! $course->capacity) {
                return 0;
            }

            return max((int) $course->capacity - (int) $course->active_enrollments_count, 0);
        });

        $instructors = CourseSession::query()
            ->whereNotNull('instructor_name')
            ->where('instructor_name', '<>', '')
            ->distinct()
            ->count('instructor_name');

        $stats = [
            [
                'label' => 'Total Formations',
                'value' => number_format($courses->count(), 0, ',', ' '),
                'sub' => $courses->where('status', 'active')->count().' active(s)',
                'icon' => 'library_books',
                'accent' => 'slate',
            ],
            [
                'label' => 'Places Disponibles',
                'value' => number_format($availableSeats, 0, ',', ' '),
                'sub' => 'capacite ouverte',
                'icon' => 'event_seat',
                'accent' => 'primary',
            ],
            [
                'label' => 'Instructeurs Actifs',
                'value' => number_format($instructors, 0, ',', ' '),
                'sub' => 'planning renseigne',
                'icon' => 'groups',
                'accent' => 'tertiary',
            ],
            [
                'label' => 'Revenu Moyen',
                'value' => number_format($courses->count() > 0 ? $paidRevenue / $courses->count() : 0, 0, ',', ' ').' DH',
                'sub' => 'par formation',
                'icon' => 'payments',
                'accent' => 'orange',
            ],
        ];

        $courseRows = $courses->map(function (Course $course) {
            $latestSession = $course->sessions->sortByDesc('starts_at')->first();
            $revenue = (float) Payment::query()
                ->where('status', 'paid')
                ->whereHas('enrollment', fn ($query) => $query->where('course_id', $course->id))
                ->sum('amount');
            $capacity = (int) ($course->capacity ?? 0);
            $enrolled = (int) $course->active_enrollments_count;
            $occupancy = $capacity > 0 ? min(100, (int) round(($enrolled / $capacity) * 100)) : 0;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'category' => $this->categoryLabel($course->category),
                'categoryKey' => $course->category,
                'level' => $course->level,
                'description' => $course->description,
                'durationHours' => $course->duration_hours,
                'durationWeeks' => $course->duration_weeks,
                'price' => (float) $course->price,
                'capacity' => $capacity,
                'enrolled' => $enrolled,
                'occupancy' => $occupancy,
                'status' => $course->status,
                'startsAt' => $course->starts_at?->format('d/m/Y'),
                'endsAt' => $course->ends_at?->format('d/m/Y'),
                'instructor' => $latestSession?->instructor_name ?: 'Non assigne',
                'room' => $latestSession?->room,
                'sessionsCount' => (int) $course->sessions_count,
                'revenue' => $revenue,
            ];
        })->values();

        $categoryStats = $courses
            ->groupBy('category')
            ->map(fn ($items, $category) => [
                'name' => $this->categoryLabel($category),
                'value' => $items->count(),
            ])
            ->values();

        return Inertia::render('Dashboard/Admin/Courses', [
            'stats' => $stats,
            'courses' => $courseRows,
            'categories' => $courses
                ->pluck('category')
                ->filter()
                ->unique()
                ->sort()
                ->values()
                ->map(fn ($category) => ['key' => $category, 'label' => $this->categoryLabel($category)]),
            'instructors' => CourseSession::query()
                ->whereNotNull('instructor_name')
                ->where('instructor_name', '<>', '')
                ->distinct()
                ->orderBy('instructor_name')
                ->pluck('instructor_name')
                ->values(),
            'categoryStats' => $categoryStats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedCourse($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        Course::query()->create($data);

        return back()->with('success', 'Formation creee avec succes.');
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $data = $this->validatedCourse($request);
        $data['slug'] = $this->uniqueSlug($data['title'], $course->id);

        $course->update($data);

        return back()->with('success', 'Formation mise a jour.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        if ($course->enrollments()->exists()) {
            $course->update(['status' => 'inactive']);

            return back()->with('warning', 'Formation desactivee car elle contient deja des inscriptions.');
        }

        $course->delete();

        return back()->with('success', 'Formation supprimee.');
    }

    private function validatedCourse(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:120'],
            'level' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
            'duration_hours' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'duration_weeks' => ['nullable', 'integer', 'min:0', 'max:520'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999'],
            'capacity' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'status' => ['required', Rule::in(['active', 'inactive', 'draft'])],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'formation';
        $slug = $base;
        $index = 2;

        while (Course::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '<>', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$index;
            $index++;
        }

        return $slug;
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
}
