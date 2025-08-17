import React from 'react'
import { Head, Link } from '@inertiajs/react'

interface User {
  id: number;
  name: string;
  avatar_url?: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url?: string;
}

interface ReadingRecord {
  id: number;
  status: string;
  memo_markdown?: string;
  updated_at: string;
  user: User;
  book: Book;
}

interface Stats {
  total_users: number;
  total_books: number;
  total_records: number;
  public_records: number;
}

interface Props {
  recentRecords: ReadingRecord[];
  stats: Stats;
  flash?: {
    error?: string;
    success?: string;
  };
}

const Landing: React.FC<Props> = ({ recentRecords, stats, flash }) => {
  return (
    <>
      <Head title="技術書読書管理システム" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* エラーメッセージ */}
        {flash?.error && (
          <div className="mx-4 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {flash.error}
          </div>
        )}
        
        {/* ヘッダー */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  📚 Tech Book Manager
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/public/records"
                  className="text-gray-600 hover:text-gray-900"
                >
                  みんなの読書記録
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ヒーローセクション */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
              技術書の読書記録を
              <br />
              <span className="text-blue-600">もっと楽しく</span>
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              オライリーやGoogle Books APIと連携して、技術書の読書状況を管理。
              Markdownでメモを書いて、学びを記録し、仲間と共有しよう。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
              >
                今すぐ始める
              </Link>
              <Link
                href="/public/records"
                className="rounded-lg border border-blue-600 bg-white px-8 py-3 text-lg font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                読書記録を見る
              </Link>
            </div>
          </div>
        </section>

        {/* 統計情報 */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-blue-600">
                  {stats.total_users.toLocaleString()}
                </div>
                <div className="text-gray-600">ユーザー</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-green-600">
                  {stats.total_books.toLocaleString()}
                </div>
                <div className="text-gray-600">登録書籍</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">
                  {stats.total_records.toLocaleString()}
                </div>
                <div className="text-gray-600">読書記録</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-600">
                  {stats.public_records.toLocaleString()}
                </div>
                <div className="text-gray-600">公開記録</div>
              </div>
            </div>
          </div>
        </section>

        {/* 最近の読書記録 */}
        {recentRecords.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
                最近の読書記録
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/users/${record.user.id}/records/${record.id}`}
                    className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      {record.book.cover_image_url ? (
                        <img
                          src={record.book.cover_image_url}
                          alt={record.book.title}
                          className="h-20 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-16 items-center justify-center rounded bg-gray-200">
                          📖
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium text-gray-900">
                          {record.book.title}
                        </h4>
                        <p className="truncate text-sm text-gray-600">
                          {record.book.author}
                        </p>
                        <div className="mt-2 flex items-center">
                          {record.user.avatar_url ? (
                            <img
                              src={record.user.avatar_url}
                              alt={record.user.name}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                          )}
                          <span className="ml-2 text-sm text-gray-600">
                            {record.user.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/public/records"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  すべての読書記録を見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* フッター */}
        <footer className="bg-gray-900 py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-gray-400">
              © 2025 Tech Book Manager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Landing