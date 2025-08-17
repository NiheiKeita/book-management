import React, { PropsWithChildren, useState } from 'react'
import { Link, router } from '@inertiajs/react'

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Props {
  user: User;
}

const AuthenticatedLayout: React.FC<PropsWithChildren<Props>> = ({
  user,
  children,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const logout = () => {
    router.post('/logout')
  }

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard' },
    { name: '書籍を探す', href: '/books' },
    { name: '読書記録', href: '/reading-records' },
    { name: '書籍登録', href: '/books/create' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ナビゲーションバー */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              {/* ロゴ */}
              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                  📚 Tech Book Manager
                </Link>
              </div>

              {/* メインナビゲーション */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ユーザーメニュー */}
            <div className="flex items-center">
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatar_url ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar_url}
                        alt={user.name}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </div>

                {showUserMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="border-b px-4 py-2 text-sm text-gray-700">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        href={`/users/${user.id}/reading-list`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        公開ページ
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main>{children}</main>
    </div>
  )
}

export default AuthenticatedLayout