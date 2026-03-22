'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Error from NextAuth redirect
  const urlError = searchParams.get('error');
  const urlErrorMsg =
    urlError === 'CredentialsSignin' ? 'Email atau password salah.' :
    urlError === 'forbidden'         ? 'Akses ditolak. Hubungi administrator.' :
    urlError ? 'Terjadi kesalahan saat login.' : '';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email:    email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Email atau password salah.');
      return;
    }

    // Successful login
    router.push('/admin/guests');
    router.refresh();
  }

  const displayError = error || urlErrorMsg;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {displayError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={loading}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed
              transition"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-12 text-sm
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
                disabled:bg-gray-50 disabled:cursor-not-allowed
                transition"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm px-1"
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium
            hover:bg-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
            flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Masuk...
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>
    </div>
  );
}
