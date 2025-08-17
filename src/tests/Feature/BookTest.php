<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_loads(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Public/Landing'));
    }

    public function test_user_can_view_books_index(): void
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->get('/books');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Books/Index'));
    }

    public function test_user_can_create_book(): void
    {
        $user = User::factory()->create();
        
        $bookData = [
            'title' => 'Test Book',
            'author' => 'Test Author',
            'subtitle' => 'Test Subtitle',
            'publisher' => 'Test Publisher',
            'published_date' => '2024-01-01',
            'page_count' => 300,
            'description' => 'Test description',
            'category' => 'Programming',
        ];

        $response = $this->actingAs($user)->post('/books', $bookData);
        
        $this->assertDatabaseHas('books', [
            'title' => 'Test Book',
            'author' => 'Test Author',
            'source' => 'manual',
        ]);

        $book = Book::where('title', 'Test Book')->first();
        $response->assertRedirect("/books/{$book->id}");
    }

    public function test_book_search_scope_works(): void
    {
        Book::factory()->create(['title' => 'Laravel Guide', 'author' => 'John Doe']);
        Book::factory()->create(['title' => 'React Handbook', 'author' => 'Jane Smith']);
        Book::factory()->create(['title' => 'Vue.js Tutorial', 'author' => 'Bob Johnson']);

        $results = Book::search('Laravel')->get();
        $this->assertCount(1, $results);
        $this->assertEquals('Laravel Guide', $results->first()->title);

        $results = Book::search('Jane')->get();
        $this->assertCount(1, $results);
        $this->assertEquals('React Handbook', $results->first()->title);
    }
}
