import React from 'react'
import { Head, Link } from '@inertiajs/react'

interface User {
  id: number
  name: string
  avatar_url?: string
}

interface Book {
  id: number
  title: string
  author: string
  cover_image_url?: string
}

interface ReadingRecord {
  id: number
  status: string
  memo_markdown?: string
  updated_at: string
  book: Book
}

interface Props {
  user: User
  records: {
    data: ReadingRecord[]
  }
  statusCounts: {
    want_to_read: number
    reading: number
    read: number
  }
  filters: {
    status?: string
    search?: string
  }
}

const UserReadingList: React.FC<Props> = ({ user, records, statusCounts, filters }) => {
  return (
    <>
      <Head title={`${user.name}の読書記録`} />
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-xl font-bold text-gray-900"
                >
                  📚 Tech Book Manager
                </Link>
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
                  className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300"></div>
              )}
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">の読書記録</p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-2xl font-bold text-blue-600">
                {statusCounts.want_to_read}
              </div>
              <div className="text-sm text-gray-600">読みたい</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.reading}
              </div>
              <div className="text-sm text-gray-600">読書中</div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow">
              <div className="text-2xl font-bold text-purple-600">
                {statusCounts.read}
              </div>
              <div className="text-sm text-gray-600">読了</div>
            </div>
          </div>

          {records.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {records.data.map((record) => (
                <Link
                  key={record.id}
                  href={`/users/${user.id}/records/${record.id}`}
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
                      <h3 className="truncate font-medium text-gray-900">
                        {record.book.title}
                      </h3>
                      <p className="truncate text-sm text-gray-600">
                        {record.book.author}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          record.status === 'read' 
                            ? 'bg-purple-100 text-purple-800'
                            : record.status === 'reading'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {record.status === 'read' ? '読了' : record.status === 'reading' ? '読書中' : '読みたい'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">📚</div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                読書記録がありません
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                まだ公開されている読書記録がありません。
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default UserReadingList