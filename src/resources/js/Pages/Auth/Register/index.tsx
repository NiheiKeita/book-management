import React from 'react'
import { Head, Link, useForm } from '@inertiajs/react'

const Register: React.FC = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <>
      <Head title="登録" />
      
      <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
        <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
          <div className="mb-6 text-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              📚 Tech Book Manager
            </Link>
          </div>

          <form onSubmit={submit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                お名前
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                autoComplete="name"
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && (
                <div className="mt-2 text-sm text-red-600">{errors.name}</div>
              )}
            </div>

            <div className="mt-4">
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
                autoComplete="new-password"
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              {errors.password && (
                <div className="mt-2 text-sm text-red-600">{errors.password}</div>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                パスワード確認
              </label>
              <input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                autoComplete="new-password"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />
              {errors.password_confirmation && (
                <div className="mt-2 text-sm text-red-600">{errors.password_confirmation}</div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Link
                href="/login"
                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                すでにアカウントをお持ちですか？
              </Link>

              <button
                type="submit"
                className="ml-4 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-blue-900"
                disabled={processing}
              >
                登録
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default Register