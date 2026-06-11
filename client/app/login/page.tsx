'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { LOGIN } from '@/graphql/mutations';
import type { LoginMutation, LoginMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data } = await login({ variables: { userName, password } });
    const msg: string = data?.login ?? '';
    if (msg.toLowerCase().includes('logged in')) {
      refetch();
      router.push('/');
    } else {
      setError(msg || 'Login failed.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded border border-gray-200 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Log In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            autoComplete="username"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-orange-500 hover:underline">Register</Link>
      </p>
    </div>
  );
}
