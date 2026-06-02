<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrNew([
            'email' => env('ADMIN_EMAIL', 'admin@infosaloua.com'),
        ]);

        $admin->forceFill([
            'name' => env('ADMIN_NAME', 'Admin Info Saloua'),
            'phone' => env('ADMIN_PHONE'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified_at' => now(),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'ChangeMe123!')),
        ])->save();
    }
}
