<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();
            $table->string('group_name')->nullable();
            $table->string('room')->nullable();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('status')->default('active')->index();
            $table->string('payment_status')->default('pending')->index();
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('next_session_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
