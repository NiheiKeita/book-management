import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

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
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      want_to_read: 'bg-yellow-100 text-yellow-800',
      reading: 'bg-blue-100 text-blue-800',
      read: 'bg-green-100 text-green-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <AuthenticatedLayout user={user}>
      <Head title="ダッシュボード" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* ウェルカムセクション */}
          <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    こんにちは、{user.name}さん！
                  </h1>
                  <p className="mt-1 text-gray-600">
                    技術書の読書記録を管理しましょう
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/books"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    書籍を探す
                  </Link>
                  <Link
                    href="/books/create"
                    className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    書籍を登録
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 読書ステータス */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  読書ステータス
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">読みたい</span>
                    <span className="font-medium">{statusCounts.want_to_read}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">読んでいる</span>
                    <span className="font-medium">{statusCounts.reading}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">読了</span>
                    <span className="font-medium">{statusCounts.read}</span>
                  </div>
                </div>
                <Link
                  href="/reading-records"
                  className="mt-4 block w-full text-center font-medium text-blue-600 hover:text-blue-700"
                >
                  すべての記録を見る
                </Link>
              </div>
            </div>

            {/* 読書実績 */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  読書実績
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">今月</span>
                    <span className="font-medium">{readingStats.this_month_read}冊</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">今年</span>
                    <span className="font-medium">{readingStats.this_year_read}冊</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">総読書数</span>
                    <span className="font-medium">{readingStats.total_read}冊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  クイックアクション
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/reading-records/create"
                    className="block w-full rounded-md bg-blue-50 px-3 py-2 text-center text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    読書記録を追加
                  </Link>
                  <Link
                    href="/books/create"
                    className="block w-full rounded-md bg-green-50 px-3 py-2 text-center text-green-700 transition-colors hover:bg-green-100"
                  >
                    書籍を登録
                  </Link>
                  <Link
                    href={`/users/${user.id}/reading-list`}
                    className="block w-full rounded-md bg-purple-50 px-3 py-2 text-center text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    公開ページを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 最近の読書記録 */}
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  最近の読書記録
                </h3>
                <Link
                  href="/reading-records"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  すべて見る
                </Link>
              </div>

              {recentRecords.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-gray-500">
                    まだ読書記録がありません
                  </p>
                  <Link
                    href="/books"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    書籍を探して記録を始める
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentRecords.map((record) => (
                    <Link
                      key={record.id}
                      href={`/reading-records/${record.id}`}
                      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start space-x-3">
                        {record.book.cover_image_url ? (
                          <img
                            src={record.book.cover_image_url}
                            alt={record.book.title}
                            className="h-16 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded bg-gray-200 text-xl">
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
                          <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${getStatusColor(record.status)}`}>
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
  )
}

export default Dashboard