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
  user: User
  book: Book
}

interface Props {
  records: {
    data: ReadingRecord[]
  }
  filters: {
    search?: string
    status?: string
  }
}

const AllRecords: React.FC<Props> = ({ records, filters }) => {
  return (
    <>
      <Head title="みんなの読書記録" />
      
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
            <h1 className="text-3xl font-bold text-gray-900">みんなの読書記録</h1>
            <p className="mt-2 text-gray-600">
              コミュニティのメンバーが共有している読書記録をご覧ください
            </p>
          </div>

          {records.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {records.data.map((record) => (
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
                      <h3 className="truncate font-medium text-gray-900">
                        {record.book.title}
                      </h3>
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

export default AllRecords