'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { REGISTER } from '@/graphql/mutations';
import type { RegisterMutation, RegisterMutationVariables } from '@/graphql/__generated__/graphql';
import { inputStyle } from '@/lib/styles';

export default function RegisterPage() {
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
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)', padding: 32, textAlign: 'center' }}>
          <h2 className="serif" style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>Check your email</h2>
          <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 20px' }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Go to login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)', padding: 32 }}>
        <h1 className="serif" style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Create account
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="form-input"
              style={inputStyle}
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
              className="form-input"
              style={inputStyle}
            />
            <p className="meta" style={{ margin: '5px 0 0', fontSize: 11 }}>Min 8 chars, 1 uppercase, 1 number, 1 symbol</p>
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
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p style={{ margin: '18px 0 0', fontSize: 13.5, color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
