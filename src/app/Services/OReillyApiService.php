<?php

namespace App\Services;

use App\Models\Book;
use App\Models\ApiSyncLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OReillyApiService
{
    private ?string $baseUrl;
    private ?string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.oreilly.base_url');
        $this->apiKey = config('services.oreilly.api_key');
    }

    public function syncAllBooks(): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/catalog/titles');

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . $response->status());
            }

            $books = $response->json()['results'] ?? [];
            $syncedCount = 0;

            foreach ($books as $bookData) {
                $this->saveBook($bookData);
                $syncedCount++;
            }

            ApiSyncLog::logSync(
                'oreilly',
                'success',
                "Synced {$syncedCount} books from O'Reilly API"
            );

            return true;
        } catch (\Exception $e) {
            Log::error('O\'Reilly API sync failed: ' . $e->getMessage());
            
            ApiSyncLog::logSync(
                'oreilly',
                'failure',
                $e->getMessage()
            );

            return false;
        }
    }

    public function checkNewBooks(): array
    {
        try {
            $lastSync = ApiSyncLog::bySource('oreilly')
                ->byStatus('success')
                ->latest()
                ->first();

            $params = [];
            if ($lastSync) {
                $params['updated_since'] = $lastSync->created_at->format('Y-m-d');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/catalog/titles', $params);

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . $response->status());
            }

            $books = $response->json()['results'] ?? [];
            $newBooks = [];

            foreach ($books as $bookData) {
                $isbn = $bookData['isbn'] ?? null;
                if ($isbn && !Book::where('isbn', $isbn)->exists()) {
                    $this->saveBook($bookData);
                    $newBooks[] = $bookData;
                }
            }

            ApiSyncLog::logSync(
                'oreilly',
                'success',
                "Found and synced " . count($newBooks) . " new books"
            );

            return $newBooks;
        } catch (\Exception $e) {
            Log::error('O\'Reilly new books check failed: ' . $e->getMessage());
            
            ApiSyncLog::logSync(
                'oreilly',
                'failure',
                $e->getMessage()
            );

            return [];
        }
    }

    private function saveBook(array $bookData): Book
    {
        return Book::updateOrCreate(
            ['isbn' => $bookData['isbn'] ?? null],
            [
                'title' => $bookData['title'],
                'subtitle' => $bookData['subtitle'] ?? null,
                'author' => $this->formatAuthors($bookData['authors'] ?? []),
                'publisher' => $bookData['publisher'] ?? null,
                'published_date' => $this->parseDate($bookData['published'] ?? null),
                'page_count' => $bookData['pages'] ?? null,
                'cover_image_url' => $bookData['cover_url'] ?? null,
                'description' => $bookData['description'] ?? null,
                'category' => $this->formatCategories($bookData['subjects'] ?? []),
                'source' => 'oreilly',
            ]
        );
    }

    private function formatAuthors(array $authors): string
    {
        return implode(', ', array_column($authors, 'name'));
    }

    private function formatCategories(array $subjects): ?string
    {
        if (empty($subjects)) {
            return null;
        }
        return implode(', ', $subjects);
    }

    private function parseDate(?string $dateString): ?string
    {
        if (!$dateString) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($dateString)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}