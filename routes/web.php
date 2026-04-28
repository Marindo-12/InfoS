<?php

use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\PaymentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Routes Publiques
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

Route::get('/formations', function () {
    return Inertia::render('Public/Formations');
})->name('formations');

Route::get('/about', function () {
    return Inertia::render('Public/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Public/Contact');
})->name('contact');

Route::prefix('inscriptions')->name('inscriptions.')->group(function () {
    Route::get('/langues', function () {
        return Inertia::render('Inscriptions/Langues');
    })->name('langues');

    Route::get('/bureautique', function () {
        return Inertia::render('Inscriptions/Bureautique');
    })->name('bureautique');

    Route::get('/concours', function () {
        return Inertia::render('Inscriptions/Concours');
    })->name('concours');

    Route::get('/infographie', function () {
        return Inertia::render('Inscriptions/Infographie');
    })->name('infographie');
});

Route::get('/inscriptions', function () {
    return Inertia::render('Inscriptions/Index');
})->name('inscriptions');

/*
|--------------------------------------------------------------------------
| Routes Auth (générées par Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Dashboard/Student/Dashboard');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Routes Étudiant (protégées)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Student/Dashboard');
    })->name('dashboard');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses');

    Route::get('/progress', function () {
        return Inertia::render('Student/Progress');
    })->name('progress');

    Route::get('/schedule', function () {
        return Inertia::render('Student/Schedule');
    })->name('schedule');

    Route::get('/notifications', function() {
        return Inertia::render('Dashboard/Student/Notifications');
    })->name('notifications');

    Route::get('/payment', [PaymentController::class, 'index'])->name('payment');
});

/*
|--------------------------------------------------------------------------
| Routes Admin (protégées)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    Route::get('/applications', function () {
        return Inertia::render('Admin/Applications');
    })->name('applications');

    Route::get('/students', function () {
        return Inertia::render('Dashboard/Admin/Students');
    })->name('students');

    Route::get('/courses', function () {
        return Inertia::render('Admin/Courses');
    })->name('courses');

    Route::get('/payments', function () {
        return Inertia::render('Admin/Payments');
    })->name('payments');

    Route::get('/reports', function () {
        return Inertia::render('Admin/Reports');
    })->name('reports');
});

/*
|--------------------------------------------------------------------------
| Profile (Breeze)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
