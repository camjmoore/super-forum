'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { LOGIN } from '@/graphql/mutations';
import type { LoginMutation, LoginMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14.5,
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color .15s',
};

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
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)', padding: 32 }}>
        <h1 className="serif" style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Welcome back
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              autoComplete="username"
              className="form-input"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="form-input"
              style={inputStyle}
            />
          </div>
          {error && <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 42, borderRadius: 99, border: 'none',
              background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)',
              fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
              opacity: loading ? 0.6 : 1, transition: 'opacity .15s',
            }}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p style={{ margin: '18px 0 0', fontSize: 13.5, color: 'var(--muted)', textAlign: 'center' }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
