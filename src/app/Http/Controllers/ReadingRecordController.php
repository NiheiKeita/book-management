<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\ReadingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReadingRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->readingRecords()
            ->with('book');

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
            'want_to_read' => auth()->user()->readingRecordsByStatus('want_to_read')->count(),
            'reading' => auth()->user()->readingRecordsByStatus('reading')->count(),
            'read' => auth()->user()->readingRecordsByStatus('read')->count(),
        ];

        return Inertia::render('ReadingRecords/Index', [
            'records' => $records,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(ReadingRecord $readingRecord)
    {
        $this->authorize('view', $readingRecord);

        $readingRecord->load('book');

        return Inertia::render('ReadingRecords/Show', [
            'record' => $readingRecord,
        ]);
    }

    public function create(Request $request)
    {
        $book = null;
        if ($request->filled('book_id')) {
            $book = Book::findOrFail($request->book_id);
            
            $existingRecord = auth()->user()->readingRecords()
                ->where('book_id', $book->id)
                ->first();
                
            if ($existingRecord) {
                return redirect()->route('reading-records.edit', $existingRecord)
                    ->with('info', 'この書籍の読書記録は既に存在します。');
            }
        }

        return Inertia::render('ReadingRecords/Create', [
            'book' => $book,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'status' => 'required|in:want_to_read,reading,read',
            'read_date' => 'nullable|date',
            'memo_markdown' => 'nullable|string',
            'memo_public' => 'boolean',
        ]);

        $existingRecord = auth()->user()->readingRecords()
            ->where('book_id', $request->book_id)
            ->first();

        if ($existingRecord) {
            return redirect()->route('reading-records.edit', $existingRecord)
                ->with('info', 'この書籍の読書記録は既に存在します。');
        }

        $record = auth()->user()->readingRecords()->create($request->validated());

        return redirect()->route('reading-records.show', $record)
            ->with('success', '読書記録を作成しました。');
    }

    public function edit(ReadingRecord $readingRecord)
    {
        $this->authorize('update', $readingRecord);

        $readingRecord->load('book');

        return Inertia::render('ReadingRecords/Edit', [
            'record' => $readingRecord,
        ]);
    }

    public function update(Request $request, ReadingRecord $readingRecord)
    {
        $this->authorize('update', $readingRecord);

        $request->validate([
            'status' => 'required|in:want_to_read,reading,read',
            'read_date' => 'nullable|date',
            'memo_markdown' => 'nullable|string',
            'memo_public' => 'boolean',
        ]);

        $readingRecord->update($request->validated());

        return redirect()->route('reading-records.show', $readingRecord)
            ->with('success', '読書記録を更新しました。');
    }

    public function destroy(ReadingRecord $readingRecord)
    {
        $this->authorize('delete', $readingRecord);

        $readingRecord->delete();

        return redirect()->route('reading-records.index')
            ->with('success', '読書記録を削除しました。');
    }

    public function addFromBook(Book $book)
    {
        $existingRecord = auth()->user()->readingRecords()
            ->where('book_id', $book->id)
            ->first();

        if ($existingRecord) {
            return redirect()->route('reading-records.edit', $existingRecord)
                ->with('info', 'この書籍の読書記録は既に存在します。');
        }

        $record = auth()->user()->readingRecords()->create([
            'book_id' => $book->id,
            'status' => 'want_to_read',
            'memo_public' => false,
        ]);

        return redirect()->route('reading-records.edit', $record)
            ->with('success', '読書記録を作成しました。詳細を設定してください。');
    }
}
