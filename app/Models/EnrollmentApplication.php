<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnrollmentApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'reference',
        'first_name',
        'last_name',
        'email',
        'phone',
        'category',
        'training_label',
        'amount',
        'payment_method',
        'payment_status',
        'payment_reference',
        'preferred_payment_date',
        'certificate_reference',
        'status',
        'form_data',
        'approved_at',
        'approved_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'preferred_payment_date' => 'date',
            'form_data' => 'array',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
