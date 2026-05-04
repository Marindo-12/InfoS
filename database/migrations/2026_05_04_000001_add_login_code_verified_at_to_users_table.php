<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('login_code_verified_at')->nullable()->after('email_verified_at');
        });

        DB::table('users')
            ->whereIn('id', function ($query) {
                $query->select('user_id')
                    ->from('login_verification_codes')
                    ->whereNotNull('used_at');
            })
            ->update(['login_code_verified_at' => now()]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('login_code_verified_at');
        });
    }
};
