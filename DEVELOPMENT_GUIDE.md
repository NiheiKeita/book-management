# 技術書読書管理システム開発ガイド

## 概要

技術書の読書状況を記録・管理できるWebシステム。オライリーAPIおよびGoogle Books APIと連携して書籍情報を自動取得し、Markdownでメモを書いて学びを記録、仲間と共有できる。

## 技術スタック

- **バックエンド**: Laravel 11.x
- **フロントエンド**: React 18 + Inertia.js + TailwindCSS
- **データベース**: MySQL 8.3
- **認証**: Laravel Socialite (Google OAuth)
- **API連携**: オライリーAPI, Google Books API
- **開発環境**: Docker Compose
- **パッケージ管理**: Composer, npm

## システム構成

```
book-management/
├── docker-compose.yml
├── docker/
│   ├── app/Dockerfile
│   ├── db/Dockerfile
│   └── nginx/Dockerfile
└── src/
    ├── app/
    ├── resources/js/
    ├── database/
    └── routes/
```

## データベース設計

### テーブル構造

#### users (ユーザー)
```sql
- id: bigint (PK)
- name: string (必須)
- email: string (必須)
- google_id: string (必須, unique)
- avatar_url: string (任意)
- email_verified_at: timestamp
- password: string (nullable)
- created_at, updated_at: timestamp
```

#### books (書籍)
```sql
- id: bigint (PK)
- isbn: string (任意, index)
- title: string (必須)
- subtitle: string (任意)
- author: string (必須)
- publisher: string (任意)
- published_date: date (任意)
- page_count: integer (任意)
- cover_image_url: string (任意)
- description: text (任意)
- category: string (任意)
- source: enum('oreilly', 'google', 'manual') (必須)
- created_at, updated_at: timestamp
```

#### reading_records (読書記録)
```sql
- id: bigint (PK)
- user_id: bigint (FK to users.id)
- book_id: bigint (FK to books.id)
- status: enum('want_to_read', 'reading', 'read') (必須)
- read_date: date (任意)
- memo_markdown: text (任意)
- memo_public: boolean (デフォルト: false)
- created_at, updated_at: timestamp
- unique(user_id, book_id)
```

#### api_sync_logs (API同期ログ)
```sql
- id: bigint (PK)
- source: enum('oreilly', 'google') (必須)
- status: enum('success', 'failure') (必須)
- message: text (任意)
- created_at: timestamp
```

## 主要機能

### 1. 認証システム
- Google OAuth 2.0による認証
- Laravel Socialiteを使用
- ユーザー情報の自動取得・更新

### 2. 書籍管理
- ISBN検索による自動書籍情報取得
- 手動書籍登録
- 書籍検索・フィルタリング機能

### 3. 読書記録管理
- 読書ステータス管理（読みたい/読んでいる/読了）
- Markdownによるメモ機能
- 公開/非公開設定

### 4. 公開ページ
- ユーザー別読書リスト表示
- 公開メモの閲覧機能
- 統計情報の表示

### 5. API連携
- オライリーAPI: 技術書データの一括取得・同期
- Google Books API: ISBN検索・書籍情報取得

### 6. バッチ処理
- 毎月1日午前3時にオライリー新刊チェック
- Laravelスケジューラーによる自動実行

## セットアップ手順

### 1. 環境構築

```bash
# リポジトリクローン
git clone <repository-url>
cd book-management

# 環境変数設定
cp src/.env.example src/.env

# Docker起動
docker-compose up -d

# 依存関係インストール
cd src
composer install
npm install
```

### 2. 環境変数設定

```bash
# .envファイルの主要設定項目

# アプリケーション
APP_NAME="Tech Book Manager"
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=Asia/Tokyo

# データベース
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=book_management
DB_USERNAME=root
DB_PASSWORD=password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback

# API設定
OREILLY_API_KEY=your_oreilly_api_key
OREILLY_API_BASE_URL=https://api.oreilly.com
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### 3. データベース初期化

```bash
# アプリケーションキー生成
docker-compose exec app php artisan key:generate

# マイグレーション実行
docker-compose exec app php artisan migrate

# (オプション) シーダー実行
docker-compose exec app php artisan db:seed
```

### 4. フロントエンド構築

```bash
# 開発用ビルド
npm run dev

# 本番用ビルド
npm run build
```

## ディレクトリ構造詳細

### バックエンド (Laravel)

```
src/app/
├── Http/Controllers/
│   ├── Auth/GoogleController.php          # Google OAuth認証
│   ├── BookController.php                 # 書籍CRUD
│   ├── ReadingRecordController.php        # 読書記録CRUD
│   └── PublicController.php               # 公開ページ
├── Models/
│   ├── User.php                          # ユーザーモデル
│   ├── Book.php                          # 書籍モデル
│   ├── ReadingRecord.php                 # 読書記録モデル
│   └── ApiSyncLog.php                    # API同期ログ
├── Services/
│   ├── OReillyApiService.php             # オライリーAPI連携
│   └── GoogleBooksApiService.php         # Google Books API連携
├── Console/Commands/
│   └── SyncOReillyBooks.php              # オライリー同期コマンド
└── Policies/
    └── ReadingRecordPolicy.php           # 読書記録認可
```

### フロントエンド (React)

```
src/resources/js/
├── Pages/
│   ├── Public/
│   │   ├── Landing.tsx                   # ランディングページ
│   │   ├── UserReadingList.tsx           # ユーザー別読書リスト
│   │   └── ReadingRecord.tsx             # 公開読書記録詳細
│   ├── Books/
│   │   ├── Index.tsx                     # 書籍一覧
│   │   ├── Show.tsx                      # 書籍詳細
│   │   └── Create.tsx                    # 書籍登録
│   ├── ReadingRecords/
│   │   ├── Index.tsx                     # 読書記録一覧
│   │   ├── Show.tsx                      # 読書記録詳細
│   │   ├── Create.tsx                    # 読書記録作成
│   │   └── Edit.tsx                      # 読書記録編集
│   └── Dashboard.tsx                     # ダッシュボード
├── Components/
│   ├── MarkdownEditor/index.tsx          # Markdownエディタ
│   └── MarkdownPreview/index.tsx         # Markdownプレビュー
└── Layouts/
    └── AuthenticatedLayout.tsx           # 認証済みレイアウト
```

## API仕様

### ルート設計

#### 公開ルート
```php
GET /                                     # ランディングページ
GET /users/{user}/reading-list            # ユーザー読書リスト
GET /users/{user}/records/{record}        # 公開読書記録
GET /public/records                       # 全公開記録
```

#### 認証ルート
```php
GET /auth/google                          # Google OAuth開始
GET /auth/google/callback                 # Google OAuth コールバック
```

#### 認証必須ルート
```php
GET /dashboard                            # ダッシュボード
GET|POST /books                           # 書籍一覧・作成
GET /books/{book}                         # 書籍詳細
POST /books/search-isbn                   # ISBN検索
GET|POST /reading-records                 # 読書記録一覧・作成
GET|PUT|DELETE /reading-records/{record}  # 読書記録詳細・更新・削除
```

### API連携仕様

#### オライリーAPI
```php
// 全書籍同期
$service = new OReillyApiService();
$success = $service->syncAllBooks();

// 新刊チェック
$newBooks = $service->checkNewBooks();
```

#### Google Books API
```php
// ISBN検索
$service = new GoogleBooksApiService();
$bookData = $service->searchByIsbn('9784873119038');

// 書籍作成
$book = $service->createBookFromIsbn('9784873119038');
```

## 開発時の注意点

### 1. Eloquentリレーション
```php
// User → ReadingRecord
$user->readingRecords()->with('book')->get();

// ReadingRecord → User, Book
$record->user;
$record->book;

// Book → ReadingRecord
$book->readingRecords()->public()->get();
```

### 2. スコープの活用
```php
// 書籍検索
Book::search('Laravel')->get();

// 公開記録のみ
ReadingRecord::public()->get();

// ステータス別
ReadingRecord::byStatus('read')->get();
```

### 3. 認可ポリシー
```php
// ReadingRecordPolicyを使用
$this->authorize('view', $readingRecord);
$this->authorize('update', $readingRecord);
```

### 4. バッチ処理
```php
// コマンド手動実行
php artisan books:sync-oreilly
php artisan books:sync-oreilly --all

// スケジュール確認
php artisan schedule:list
```

## デプロイメント

### 1. 本番環境設定
```bash
# 環境変数
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# データベース本番設定
# Google OAuth本番設定
# API Key本番設定
```

### 2. 最適化
```bash
# 設定キャッシュ
php artisan config:cache

# ルートキャッシュ
php artisan route:cache

# ビューキャッシュ
php artisan view:cache

# フロントエンド本番ビルド
npm run build
```

### 3. Cronジョブ設定
```bash
# サーバーのcrontabに追加
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

## テスト

### 基本テスト実行
```bash
# 全テスト実行
php artisan test

# 特定テスト実行
php artisan test --filter BookTest
```

### テストカバレッジ
- 書籍CRUD機能
- 読書記録CRUD機能
- API連携機能
- 認証・認可機能

## トラブルシューティング

### よくある問題

1. **Docker起動エラー**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. **データベース接続エラー**
   ```bash
   # .envのDB設定確認
   # Dockerコンテナ状態確認
   docker-compose ps
   ```

3. **API連携エラー**
   ```bash
   # API Keyの設定確認
   # ログ確認
   tail -f storage/logs/laravel.log
   ```

4. **フロントエンドビルドエラー**
   ```bash
   npm ci
   npm run build
   ```

## 拡張可能性

### 今後の機能追加候補
- 読書ゴール設定機能
- レビュー・評価機能
- おすすめ書籍機能
- 読書統計ダッシュボード
- ソーシャル機能（フォロー・いいね）
- モバイルアプリ対応
- 多言語対応

この開発ガイドに従って、０から同等のシステムを構築することが可能です。