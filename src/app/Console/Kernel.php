<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('queue:restart')->everyMinute();
        $schedule->command('queue:work')->everyMinute();
        
        // オライリーAPI同期（毎月1日午前3時）
        $schedule->command('books:sync-oreilly')
            ->monthlyOn(1, '03:00')
            ->timezone('Asia/Tokyo');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
