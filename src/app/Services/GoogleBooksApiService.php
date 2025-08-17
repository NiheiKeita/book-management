<?php

namespace App\Services;

use App\Models\Book;
use App\Models\ApiSyncLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleBooksApiService
{
    private ?string $baseUrl;
    private ?string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.google_books.base_url');
        $this->apiKey = config('services.google_books.api_key');
    }

    public function searchByIsbn(string $isbn): ?array
    {
        try {
            $response = Http::get($this->baseUrl . '/volumes', [
                'q' => 'isbn:' . $isbn,
                'key' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . $response->status());
            }

            $data = $response->json();
            $items = $data['items'] ?? [];

            if (empty($items)) {
                return null;
            }

            return $this->formatBookData($items[0]);
        } catch (\Exception $e) {
            Log::error('Google Books API search failed: ' . $e->getMessage());
            return null;
        }
    }

    public function searchByTitle(string $title, string $author = null): array
    {
        try {
            $query = 'intitle:' . $title;
            if ($author) {
                $query .= '+inauthor:' . $author;
            }

            $response = Http::get($this->baseUrl . '/volumes', [
                'q' => $query,
                'key' => $this->apiKey,
                'maxResults' => 10,
            ]);

            if (!$response->successful()) {
                throw new \Exception('API request failed: ' . $response->status());
            }

            $data = $response->json();
            $items = $data['items'] ?? [];

            return array_map([$this, 'formatBookData'], $items);
        } catch (\Exception $e) {
            Log::error('Google Books API search failed: ' . $e->getMessage());
            return [];
        }
    }

    public function createBookFromIsbn(string $isbn): ?Book
    {
        try {
            $bookData = $this->searchByIsbn($isbn);
            
            if (!$bookData) {
                ApiSyncLog::logSync(
                    'google',
                    'failure',
                    "No book found for ISBN: {$isbn}"
                );
                return null;
            }

            $book = Book::updateOrCreate(
                ['isbn' => $isbn],
                [
                    'title' => $bookData['title'],
                    'subtitle' => $bookData['subtitle'],
                    'author' => $bookData['author'],
                    'publisher' => $bookData['publisher'],
                    'published_date' => $bookData['published_date'],
                    'page_count' => $bookData['page_count'],
                    'cover_image_url' => $bookData['cover_image_url'],
                    'description' => $bookData['description'],
                    'category' => $bookData['category'],
                    'source' => 'google',
                ]
            );

            ApiSyncLog::logSync(
                'google',
                'success',
                "Book created from ISBN: {$isbn}"
            );

            return $book;
        } catch (\Exception $e) {
            Log::error('Google Books book creation failed: ' . $e->getMessage());
            
            ApiSyncLog::logSync(
                'google',
                'failure',
                $e->getMessage()
            );

            return null;
        }
    }

    private function formatBookData(array $item): array
    {
        $volumeInfo = $item['volumeInfo'] ?? [];
        $industryIdentifiers = $volumeInfo['industryIdentifiers'] ?? [];
        
        $isbn = null;
        foreach ($industryIdentifiers as $identifier) {
            if (in_array($identifier['type'], ['ISBN_13', 'ISBN_10'])) {
                $isbn = $identifier['identifier'];
                break;
            }
        }

        return [
            'isbn' => $isbn,
            'title' => $volumeInfo['title'] ?? '',
            'subtitle' => $volumeInfo['subtitle'] ?? null,
            'author' => implode(', ', $volumeInfo['authors'] ?? []),
            'publisher' => $volumeInfo['publisher'] ?? null,
            'published_date' => $this->parseDate($volumeInfo['publishedDate'] ?? null),
            'page_count' => $volumeInfo['pageCount'] ?? null,
            'cover_image_url' => $this->getCoverImageUrl($volumeInfo['imageLinks'] ?? []),
            'description' => $volumeInfo['description'] ?? null,
            'category' => implode(', ', $volumeInfo['categories'] ?? []),
        ];
    }

    private function getCoverImageUrl(array $imageLinks): ?string
    {
        $priorities = ['extraLarge', 'large', 'medium', 'small', 'thumbnail'];
        
        foreach ($priorities as $size) {
            if (isset($imageLinks[$size])) {
                return str_replace('http://', 'https://', $imageLinks[$size]);
            }
        }
        
        return null;
    }

    private function parseDate(?string $dateString): ?string
    {
        if (!$dateString) {
            return null;
        }

        try {
            if (strlen($dateString) === 4) {
                return $dateString . '-01-01';
            }
            
            if (strlen($dateString) === 7) {
                return $dateString . '-01';
            }
            
            return \Carbon\Carbon::parse($dateString)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}