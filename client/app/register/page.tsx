'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { REGISTER } from '@/graphql/mutations';
import type { RegisterMutation, RegisterMutationVariables } from '@/graphql/__generated__/graphql';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [register, { loading }] = useMutation<RegisterMutation, RegisterMutationVariables>(REGISTER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data } = await register({ variables: { email, userName, password } });
    const result = data?.register;
    if (result?.__typename === 'User') {
      setSuccess(true);
    } else {
      setError(result?.messages?.[0] || 'Registration failed.');
    }
  };

  if (success) {
    return (
      <div className="max-w-sm mx-auto mt-10 bg-white rounded border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h2>
        <p className="text-sm text-gray-600 mb-4">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/login" className="text-orange-500 hover:underline text-sm">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded border border-gray-200 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
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
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1">Min 8 chars, 1 uppercase, 1 number, 1 symbol</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-500 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
