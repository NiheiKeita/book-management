<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ReadingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function landing()
    {
        $recentPublicRecords = ReadingRecord::with(['user', 'book'])
            ->public()
            ->whereNotNull('memo_markdown')
            ->orderBy('updated_at', 'desc')
            ->take(6)
            ->get();

        $stats = [
            'total_users' => User::count(),
            'total_books' => \App\Models\Book::count(),
            'total_records' => ReadingRecord::count(),
            'public_records' => ReadingRecord::public()->count(),
        ];

        return Inertia::render('Public/Landing', [
            'recentRecords' => $recentPublicRecords,
            'stats' => $stats,
        ]);
    }

    public function userReadingList(User $user, Request $request)
    {
        $query = $user->readingRecords()
            ->with('book')
            ->public();

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('search')) {
            $query->whereHas('book', function ($q) use ($request) {
                $q->search($request->search);
            });
        }

        $records = $query->orderBy('updated_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $statusCounts = [
            'want_to_read' => $user->readingRecords()->public()->byStatus('want_to_read')->count(),
            'reading' => $user->readingRecords()->public()->byStatus('reading')->count(),
            'read' => $user->readingRecords()->public()->byStatus('read')->count(),
        ];

        return Inertia::render('Public/UserReadingList', [
            'user' => $user->only(['id', 'name', 'avatar_url']),
            'records' => $records,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function readingRecord(User $user, ReadingRecord $readingRecord)
    {
        if ($readingRecord->user_id !== $user->id) {
            abort(404);
        }

        if (!$readingRecord->memo_public) {
            abort(404);
        }

        $readingRecord->load('book');

        return Inertia::render('Public/ReadingRecord', [
            'user' => $user->only(['id', 'name', 'avatar_url']),
            'record' => $readingRecord,
        ]);
    }

    public function allPublicRecords(Request $request)
    {
        $query = ReadingRecord::with(['user', 'book'])
            ->public()
            ->whereNotNull('memo_markdown');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('book', function ($bookQuery) use ($request) {
                    $bookQuery->search($request->search);
                })->orWhereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        $records = $query->orderBy('updated_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Public/AllRecords', [
            'records' => $records,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
