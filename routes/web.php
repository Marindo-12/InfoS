<?php

use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\EnrollmentApplicationController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\ScheduleController as AdminScheduleController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Student\CourseController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\NotificationController;
use App\Http\Controllers\Student\PaymentController;
use App\Http\Controllers\Student\ScheduleController as StudentScheduleController;
use App\Http\Controllers\ProfileAvatarController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicContactController;
use App\Http\Controllers\PublicEnrollmentApplicationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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

Route::post('/contact', [PublicContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.send');

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

Route::post('/inscriptions/demandes', [PublicEnrollmentApplicationController::class, 'store'])
    ->name('applications.store');

/*
|--------------------------------------------------------------------------
| Routes Auth (générées par Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->get('/dashboard', function (Request $request) {
    if ($request->user()->isStudent() && ! $request->session()->get('login_code_verified')) {
        return redirect()->route('login-code.create');
    }

    // Rediriger vers le bon dashboard selon le rôle
    if ($request->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('student.dashboard');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Routes Étudiant (protégées)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'login.code'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses');

    Route::get('/progress', function () {
        return Inertia::render('Student/Progress');
    })->name('progress');

    Route::get('/schedule', [StudentScheduleController::class, 'index'])->name('schedule');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    Route::get('/payment', [PaymentController::class, 'index'])->name('payment');
});

/*
|--------------------------------------------------------------------------
| Routes Admin (protégées)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Admin/Dashboard');
    })->name('dashboard');

    Route::get('/applications', [EnrollmentApplicationController::class, 'index'])->name('applications');
    Route::post('/applications/{application}/approve', [EnrollmentApplicationController::class, 'approve'])->name('applications.approve');
    Route::post('/applications/{application}/resend-access', [EnrollmentApplicationController::class, 'resendAccess'])->name('applications.resend-access');
    Route::post('/notifications/read-all', [AdminNotificationController::class, 'markAllRead'])->name('notifications.read-all');

    Route::get('/students', [StudentController::class, 'index'])->name('students');

    Route::get('/courses', function () {
        return Inertia::render('Dashboard/Admin/Courses');
    })->name('courses');

    Route::get('/schedule', [AdminScheduleController::class, 'index'])->name('schedule');
    Route::post('/schedule', [AdminScheduleController::class, 'store'])->name('schedule.store');
    Route::patch('/schedule/{session}', [AdminScheduleController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{session}', [AdminScheduleController::class, 'destroy'])->name('schedule.destroy');

    Route::get('/payments', [AdminPaymentController::class, 'index'])->name('payments');

    Route::get('/reports', function () {
        return Inertia::render('Dashboard/Admin/Reports');
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
    Route::post('/profile/avatar', [ProfileAvatarController::class, 'update'])->name('profile.avatar.update');
    Route::delete('/profile/avatar', [ProfileAvatarController::class, 'destroy'])->name('profile.avatar.destroy');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
