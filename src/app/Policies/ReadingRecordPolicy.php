<?php

namespace App\Policies;

use App\Models\ReadingRecord;
use App\Models\User;

class ReadingRecordPolicy
{
    public function view(User $user, ReadingRecord $readingRecord): bool
    {
        return $user->id === $readingRecord->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, ReadingRecord $readingRecord): bool
    {
        return $user->id === $readingRecord->user_id;
    }

    public function delete(User $user, ReadingRecord $readingRecord): bool
    {
        return $user->id === $readingRecord->user_id;
    }
}
