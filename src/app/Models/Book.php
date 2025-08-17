<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'isbn',
        'title',
        'subtitle',
        'author',
        'publisher',
        'published_date',
        'page_count',
        'cover_image_url',
        'description',
        'category',
        'source',
    ];

    protected $casts = [
        'published_date' => 'date',
    ];

    public function readingRecords(): HasMany
    {
        return $this->hasMany(ReadingRecord::class);
    }

    public function scopeSearch($query, $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
              ->orWhere('author', 'like', "%{$keyword}%")
              ->orWhere('isbn', 'like', "%{$keyword}%")
              ->orWhere('category', 'like', "%{$keyword}%");
        });
    }
}
