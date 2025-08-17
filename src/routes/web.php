<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ImageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Web\LoginController;
use App\Http\Controllers\Web\PasswordController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ReadingRecordController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\VerifyCsrfToken;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// 技術書読書管理システムのルート

// 公開ページ（認証不要）
Route::get('/', [PublicController::class, 'landing'])->name('landing');
Route::get('/users/{user}/reading-list', [PublicController::class, 'userReadingList'])->name('public.user.reading-list');
Route::get('/users/{user}/records/{readingRecord}', [PublicController::class, 'readingRecord'])->name('public.reading-record');
Route::get('/public/records', [PublicController::class, 'allPublicRecords'])->name('public.all-records');

// 認証ルート（ゲスト用）
Route::get('/register', [AuthController::class, 'register'])->name('register');
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'authenticate']);
// Route::middleware('guest.web')->group(function () {});


Route::group(['middleware' => 'basicauth'], function () {
    Route::fallback(function () {
        return redirect(route('landing'));
    });

    Route::middleware('guest.web')->group(function () {
        Route::get('password/edit/{token}', [PasswordController::class, 'edit'])->name('web.password.edit');
        Route::post('password/edit/{token}', [PasswordController::class, 'update'])->name('web.password.update');
    });
    Route::get('login', [LoginController::class, 'create'])->name('user.login');
    Route::post('login', [LoginController::class, 'store']);


    //管理画面側
    Route::get('admin/login', [AdminLoginController::class, 'index'])->name('admin.login');
    Route::post('admin/login', [AdminLoginController::class, 'store'])->name('admin.login');
    Route::middleware('guest.admin')->group(function () {
        Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard.index');

        Route::get('admin/admin_users', [AdminUserController::class, 'index'])->name('admin_user.list');
        Route::get('admin/admin_users/add', [AdminUserController::class, 'create'])->name('admin_user.create');
        Route::post('admin/admin_users/add', [AdminUserController::class, 'store'])->name('admin_user.store');

        Route::get('admin/users', [UserController::class, 'index'])->name('user.list');
        Route::get('admin/users/add', [UserController::class, 'create'])->name('user.create');
        Route::post('admin/users/add', [UserController::class, 'store'])->name('user.store');
        Route::get('admin/users/{id}', [UserController::class, 'edit'])->name('user.edit');
        Route::post('admin/users/{id}', [UserController::class, 'update'])->name('user.update');
    });

    // API
    Route::post('/api/upload', [ImageController::class, 'upload'])->withoutMiddleware(VerifyCsrfToken::class)->name('upload');
    Route::post('/api/upload/ma', [ImageController::class, 'maUpload'])->withoutMiddleware(VerifyCsrfToken::class)->name('upload.ma');
});

// 認証が必要なルート
Route::middleware(['auth'])->group(function () {
    // ダッシュボード
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 書籍関連
    Route::resource('books', BookController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/books/search-isbn', [BookController::class, 'searchByIsbn'])->name('books.search-isbn');
    Route::post('/books/create-from-api', [BookController::class, 'createFromApi'])->name('books.create-from-api');
    Route::post('/books/search-google', [BookController::class, 'searchGoogle'])->name('books.search-google');

    // 読書記録
    Route::resource('reading-records', ReadingRecordController::class);
    Route::post('/reading-records/add-book/{book}', [ReadingRecordController::class, 'addFromBook'])->name('reading-records.add-book');

    // ログアウト
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
