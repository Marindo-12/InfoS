<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $courses = [
            ['title' => 'Microsoft Word', 'category' => 'Bureautique', 'duration_hours' => 20, 'price' => 600],
            ['title' => 'Microsoft Excel', 'category' => 'Bureautique', 'duration_hours' => 20, 'price' => 500],
            ['title' => 'Microsoft PowerPoint', 'category' => 'Bureautique', 'duration_hours' => 12, 'price' => 300],
            ['title' => 'Microsoft Access', 'category' => 'Bureautique', 'duration_hours' => 16, 'price' => 400],

            ['title' => 'Preparation Medecine', 'category' => 'Concours', 'duration_hours' => 15, 'price' => 1000],
            ['title' => 'Preparation ENSA', 'category' => 'Concours', 'duration_hours' => 12, 'price' => 800],
            ['title' => 'Preparation ENSAM', 'category' => 'Concours', 'duration_hours' => 14, 'price' => 1200],
            ['title' => 'Preparation ENCG', 'category' => 'Concours', 'duration_hours' => 13, 'price' => 500],
            ['title' => 'Preparation ISCAE', 'category' => 'Concours', 'duration_hours' => 15, 'price' => 1200],
            ['title' => 'Preparation ENA', 'category' => 'Concours', 'duration_hours' => 10, 'price' => 600],

            ['title' => 'Adobe Photoshop', 'category' => 'Infographie', 'duration_hours' => 30, 'price' => 1000],
            ['title' => 'Adobe Illustrator', 'category' => 'Infographie', 'duration_hours' => 25, 'price' => 1000],
            ['title' => 'Adobe InDesign', 'category' => 'Infographie', 'duration_hours' => 20, 'price' => 900],

            ['title' => 'Francais', 'category' => 'Langues', 'duration_hours' => 30, 'price' => 600],
            ['title' => 'Anglais', 'category' => 'Langues', 'duration_hours' => 30, 'price' => 600],
            ['title' => 'Espagnol', 'category' => 'Langues', 'duration_hours' => 30, 'price' => 600],
        ];

        foreach ($courses as $course) {
            $slug = Str::slug($course['category'].' '.$course['title']);

            DB::table('courses')->updateOrInsert(
                ['slug' => $slug],
                [
                    'title' => $course['title'],
                    'category' => $course['category'],
                    'level' => 'General',
                    'description' => $this->descriptionFor($course['category'], $course['title']),
                    'duration_hours' => $course['duration_hours'],
                    'duration_weeks' => null,
                    'price' => $course['price'],
                    'capacity' => 20,
                    'status' => 'active',
                    'starts_at' => null,
                    'ends_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        $slugs = collect([
            'Bureautique Microsoft Word',
            'Bureautique Microsoft Excel',
            'Bureautique Microsoft PowerPoint',
            'Bureautique Microsoft Access',
            'Concours Preparation Medecine',
            'Concours Preparation ENSA',
            'Concours Preparation ENSAM',
            'Concours Preparation ENCG',
            'Concours Preparation ISCAE',
            'Concours Preparation ENA',
            'Infographie Adobe Photoshop',
            'Infographie Adobe Illustrator',
            'Infographie Adobe InDesign',
            'Langues Francais',
            'Langues Anglais',
            'Langues Espagnol',
        ])->map(fn (string $value) => Str::slug($value))->all();

        DB::table('courses')->whereIn('slug', $slugs)->delete();
    }

    private function descriptionFor(string $category, string $title): string
    {
        return match ($category) {
            'Bureautique' => $title.' pour produire des documents, tableaux et supports professionnels avec methode.',
            'Concours' => $title.' avec entrainement cible, exercices types et simulation d epreuve.',
            'Infographie' => $title.' avec ateliers pratiques, production graphique et preparation de portfolio.',
            'Langues' => $title.' avec pratique orale, grammaire active et communication quotidienne.',
            default => $title,
        };
    }
};
