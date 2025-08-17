<?php

namespace App\Console\Commands;

use App\Services\OReillyApiService;
use Illuminate\Console\Command;

class SyncOReillyBooks extends Command
{
    protected $signature = 'books:sync-oreilly {--all : Sync all books instead of just new ones}';
    protected $description = 'Sync books from O\'Reilly API';

    public function __construct(
        private OReillyApiService $oreillyApiService
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Starting O\'Reilly API sync...');
        
        if ($this->option('all')) {
            $this->info('Syncing all books...');
            $success = $this->oreillyApiService->syncAllBooks();
        } else {
            $this->info('Checking for new books...');
            $newBooks = $this->oreillyApiService->checkNewBooks();
            $success = !empty($newBooks) || count($newBooks) === 0;
            
            if (!empty($newBooks)) {
                $this->info('Found ' . count($newBooks) . ' new books');
            } else {
                $this->info('No new books found');
            }
        }

        if ($success) {
            $this->info('O\'Reilly API sync completed successfully');
            return Command::SUCCESS;
        } else {
            $this->error('O\'Reilly API sync failed');
            return Command::FAILURE;
        }
    }
}
