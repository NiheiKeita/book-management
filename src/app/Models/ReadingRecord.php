<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingRecord extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'status',
        'read_date',
        'memo_markdown',
        'memo_public',
    ];

    protected $casts = [
        'read_date' => 'date',
        'memo_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePublic($query)
    {
        return $query->where('memo_public', true);
    }

    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            'want_to_read' => '読みたい',
            'reading' => '読んでいる',
            'read' => '読了',
            default => $this->status,
        };
    }
}
