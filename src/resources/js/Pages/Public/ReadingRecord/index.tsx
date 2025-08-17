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
  description?: string
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
  record: ReadingRecord
}

const ReadingRecord: React.FC<Props> = ({ user, record }) => {
  return (
    <>
      <Head title={`${user.name} - ${record.book.title}`} />
      
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

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="mb-6 flex items-center">
              <Link
                href={`/users/${user.id}/reading-list`}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                ← {user.name}の読書記録一覧に戻る
              </Link>
            </div>

            <div className="flex items-start space-x-6">
              {record.book.cover_image_url ? (
                <img
                  src={record.book.cover_image_url}
                  alt={record.book.title}
                  className="h-48 w-32 rounded object-cover shadow-md"
                />
              ) : (
                <div className="flex h-48 w-32 items-center justify-center rounded bg-gray-200 shadow-md">
                  <span className="text-4xl">📖</span>
                </div>
              )}

              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {record.book.title}
                </h1>
                <p className="mb-4 text-lg text-gray-600">
                  {record.book.author}
                </p>

                <div className="mb-4 flex items-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  )}
                  <span className="ml-2 text-gray-700">{user.name}</span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    record.status === 'read' 
                      ? 'bg-purple-100 text-purple-800'
                      : record.status === 'reading'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.status === 'read' ? '読了' : record.status === 'reading' ? '読書中' : '読みたい'}
                  </span>
                </div>

                {record.book.description && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      書籍概要
                    </h3>
                    <p className="text-gray-700">{record.book.description}</p>
                  </div>
                )}
              </div>
            </div>

            {record.memo_markdown && (
              <div className="mt-8 border-t pt-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  読書メモ
                </h3>
                <div className="prose max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-gray-700"
                    dangerouslySetInnerHTML={{ __html: record.memo_markdown }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default ReadingRecord