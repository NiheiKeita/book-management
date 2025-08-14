import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
  id: number;
  name: string;
  email: string;
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
  book: Book;
}

interface StatusCounts {
  want_to_read: number;
  reading: number;
  read: number;
}

interface ReadingStats {
  this_month_read: number;
  this_year_read: number;
  total_read: number;
}

interface Props {
  user: User;
  recentRecords: ReadingRecord[];
  statusCounts: StatusCounts;
  readingStats: ReadingStats;
}

const Dashboard: React.FC<Props> = ({
  user,
  recentRecords,
  statusCounts,
  readingStats,
}) => {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      want_to_read: '読みたい',
      reading: '読んでいる',
      read: '読了',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      want_to_read: 'bg-yellow-100 text-yellow-800',
      reading: 'bg-blue-100 text-blue-800',
      read: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AuthenticatedLayout user={user}>
      <Head title="ダッシュボード" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* ウェルカムセクション */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    こんにちは、{user.name}さん！
                  </h1>
                  <p className="text-gray-600 mt-1">
                    技術書の読書記録を管理しましょう
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/books"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    書籍を探す
                  </Link>
                  <Link
                    href="/books/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    書籍を登録
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* 読書ステータス */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  読書ステータス
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">読みたい</span>
                    <span className="font-medium">{statusCounts.want_to_read}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">読んでいる</span>
                    <span className="font-medium">{statusCounts.reading}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">読了</span>
                    <span className="font-medium">{statusCounts.read}</span>
                  </div>
                </div>
                <Link
                  href="/reading-records"
                  className="block w-full text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  すべての記録を見る
                </Link>
              </div>
            </div>

            {/* 読書実績 */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  読書実績
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">今月</span>
                    <span className="font-medium">{readingStats.this_month_read}冊</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">今年</span>
                    <span className="font-medium">{readingStats.this_year_read}冊</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">総読書数</span>
                    <span className="font-medium">{readingStats.total_read}冊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  クイックアクション
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/reading-records/create"
                    className="block w-full text-center bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    読書記録を追加
                  </Link>
                  <Link
                    href="/books/create"
                    className="block w-full text-center bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                  >
                    書籍を登録
                  </Link>
                  <Link
                    href={`/users/${user.id}/reading-list`}
                    className="block w-full text-center bg-purple-50 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-100 transition-colors"
                  >
                    公開ページを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 最近の読書記録 */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  最近の読書記録
                </h3>
                <Link
                  href="/reading-records"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  すべて見る
                </Link>
              </div>

              {recentRecords.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    まだ読書記録がありません
                  </p>
                  <Link
                    href="/books"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    書籍を探して記録を始める
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentRecords.map((record) => (
                    <Link
                      key={record.id}
                      href={`/reading-records/${record.id}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        {record.book.cover_image_url ? (
                          <img
                            src={record.book.cover_image_url}
                            alt={record.book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xl">
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
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                            {getStatusLabel(record.status)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;