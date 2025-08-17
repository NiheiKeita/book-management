<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\GoogleBooksApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function __construct(
        private GoogleBooksApiService $googleBooksApiService
    ) {}

    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('category')) {
            $query->where('category', 'like', '%' . $request->category . '%');
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        $books = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $categories = Book::whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->flatMap(fn($cats) => explode(', ', $cats))
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'source']),
        ]);
    }

    public function show(Book $book)
    {
        $book->load(['readingRecords' => function ($query) {
            $query->with('user')->public();
        }]);

        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'isbn' => 'nullable|string|unique:books,isbn',
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'page_count' => 'nullable|integer|min:1',
            'cover_image_url' => 'nullable|url',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
        ]);

        $book = Book::create([
            ...$request->validated(),
            'source' => 'manual',
        ]);

        return redirect()->route('books.show', $book)
            ->with('success', '書籍を登録しました。');
    }

    public function searchByIsbn(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
        ]);

        $isbn = $request->isbn;

        $existingBook = Book::where('isbn', $isbn)->first();
        if ($existingBook) {
            return response()->json([
                'found' => true,
                'book' => $existingBook,
                'message' => 'この書籍は既に登録されています。',
            ]);
        }

        $bookData = $this->googleBooksApiService->searchByIsbn($isbn);
        
        if (!$bookData) {
            return response()->json([
                'found' => false,
                'message' => 'ISBNに該当する書籍が見つかりませんでした。',
            ]);
        }

        return response()->json([
            'found' => true,
            'book' => $bookData,
            'message' => 'Google Books APIから書籍情報を取得しました。',
        ]);
    }

    public function createFromApi(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
        ]);

        $book = $this->googleBooksApiService->createBookFromIsbn($request->isbn);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => '書籍の作成に失敗しました。',
            ]);
        }

        return response()->json([
            'success' => true,
            'book' => $book,
            'message' => '書籍を登録しました。',
        ]);
    }

    public function searchGoogle(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'author' => 'nullable|string',
        ]);

        $results = $this->googleBooksApiService->searchByTitle(
            $request->title,
            $request->author
        );

        return response()->json([
            'results' => $results,
        ]);
    }
}
