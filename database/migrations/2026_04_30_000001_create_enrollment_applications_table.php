<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollment_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reference')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->index();
            $table->string('phone')->nullable();
            $table->string('category')->index();
            $table->string('training_label');
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('payment_method')->index();
            $table->string('payment_status')->default('pending')->index();
            $table->string('payment_reference')->nullable();
            $table->date('preferred_payment_date')->nullable();
            $table->string('certificate_reference')->nullable();
            $table->string('status')->default('pending')->index();
            $table->json('form_data')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollment_applications');
    }
};
