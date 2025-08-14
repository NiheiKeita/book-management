import React from 'react';
import { Head, Link } from '@inertiajs/react';

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
}

const Landing: React.FC<Props> = ({ recentRecords, stats }) => {
  return (
    <>
      <Head title="技術書読書管理システム" />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
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
                  href="/auth/google"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ヒーローセクション */}
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              技術書の読書記録を
              <br />
              <span className="text-blue-600">もっと楽しく</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              オライリーやGoogle Books APIと連携して、技術書の読書状況を管理。
              Markdownでメモを書いて、学びを記録し、仲間と共有しよう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/google"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                今すぐ始める
              </Link>
              <Link
                href="/public/records"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                読書記録を見る
              </Link>
            </div>
          </div>
        </section>

        {/* 統計情報 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.total_users.toLocaleString()}
                </div>
                <div className="text-gray-600">ユーザー</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.total_books.toLocaleString()}
                </div>
                <div className="text-gray-600">登録書籍</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.total_records.toLocaleString()}
                </div>
                <div className="text-gray-600">読書記録</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                最近の読書記録
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/users/${record.user.id}/records/${record.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start space-x-4">
                      {record.book.cover_image_url ? (
                        <img
                          src={record.book.cover_image_url}
                          alt={record.book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                          📖
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {record.book.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {record.book.author}
                        </p>
                        <div className="flex items-center mt-2">
                          {record.user.avatar_url ? (
                            <img
                              src={record.user.avatar_url}
                              alt={record.user.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
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
              <div className="text-center mt-8">
                <Link
                  href="/public/records"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  すべての読書記録を見る →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* フッター */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2025 Tech Book Manager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;