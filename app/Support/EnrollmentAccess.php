<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Str;

class EnrollmentAccess
{
    public static function generatedPassword(string $firstName, string $lastName): string
    {
        $firstInitial = Str::lower(Str::substr(Str::ascii(trim($firstName)), 0, 1));
        $cleanLastName = Str::lower(Str::slug(Str::ascii(trim($lastName)), ''));
        $random = (string) random_int(1000, 9999);

        return $firstInitial.'.'.$cleanLastName.'_'.$random.'_'.now()->year;
    }

    public static function adminUsers()
    {
        return User::query()->where('role', 'admin')->get();
    }
}
