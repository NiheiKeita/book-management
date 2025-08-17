<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ReadingRecord;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        
        $recentRecords = $user->readingRecords()
            ->with('book')
            ->orderBy('updated_at', 'desc')
            ->take(6)
            ->get();

        $statusCounts = [
            'want_to_read' => $user->readingRecordsByStatus('want_to_read')->count(),
            'reading' => $user->readingRecordsByStatus('reading')->count(),
            'read' => $user->readingRecordsByStatus('read')->count(),
        ];

        $readingStats = [
            'this_month_read' => $user->readingRecords()
                ->where('status', 'read')
                ->whereMonth('read_date', now()->month)
                ->whereYear('read_date', now()->year)
                ->count(),
            'this_year_read' => $user->readingRecords()
                ->where('status', 'read')
                ->whereYear('read_date', now()->year)
                ->count(),
            'total_read' => $user->readingRecords()
                ->where('status', 'read')
                ->count(),
        ];

        return Inertia::render('Dashboard', [
            'user' => $user,
            'recentRecords' => $recentRecords,
            'statusCounts' => $statusCounts,
            'readingStats' => $readingStats,
        ]);
    }
}
