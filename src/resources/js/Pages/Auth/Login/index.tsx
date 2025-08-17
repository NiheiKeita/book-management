import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'

interface Props {
  status?: string
  canResetPassword?: boolean
}

const Login: React.FC<Props> = ({ status, canResetPassword = false }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login', {
      onFinish: () => reset('password'),
    })
  }

  return (
    <>
      <Head title="ログイン" />
      
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
        <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
          <div className="mb-6 text-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 Tech Book Manager
            </Link>
          </div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={submit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              {errors.email && (
                <div className="mt-2 text-sm text-red-600">{errors.email}</div>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={data.password}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                autoComplete="current-password"
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              {errors.password && (
                <div className="mt-2 text-sm text-red-600">{errors.password}</div>
              )}
            </div>

            <div className="mt-4 block">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">ログイン状態を保持する</span>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end">
              {canResetPassword && (
                <Link
                  href="/forgot-password"
                  className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  パスワードをお忘れですか？
                </Link>
              )}

              <button
                type="submit"
                className="ml-4 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-blue-900"
                disabled={processing}
              >
                ログイン
              </button>
            </div>
          </form>


          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                こちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login