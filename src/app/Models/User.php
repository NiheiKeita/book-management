<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'tel',
        'password_token',
        'google_id',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function readingRecords(): HasMany
    {
        return $this->hasMany(ReadingRecord::class);
    }

    public function readingRecordsByStatus($status): HasMany
    {
        return $this->readingRecords()->where('status', $status);
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($user) {
            // プランが変更されたかどうかを確認する
            if ($user->isDirty('plan_id')) {
                // プランが変更された場合、ログを保存する
                DB::table('user_plan_logs')->insert([
                    'user_id' => $user->id,
                    'plan_id' => $user->plan_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }
}
