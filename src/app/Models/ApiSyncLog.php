<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiSyncLog extends Model
{
    protected $fillable = [
        'source',
        'status',
        'message',
    ];

    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public static function logSync($source, $status, $message = null)
    {
        return self::create([
            'source' => $source,
            'status' => $status,
            'message' => $message,
        ]);
    }
}
