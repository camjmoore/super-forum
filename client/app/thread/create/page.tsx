'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_THREAD } from '@/graphql/mutations';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import type { CreateThreadMutation, CreateThreadMutationVariables, GetAllCategoriesQuery } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';
import CategoryPill from '@/components/CategoryPill';
import Link from 'next/link';
import { inputStyle } from '@/lib/styles';

export default function CreateThreadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const { data: catData } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES);
  const categories = catData?.getAllCategories?.threadCategories ?? [];
  const [createThread, { loading }] = useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CREATE_THREAD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data } = await createThread({ variables: { categoryId, title, body } });
    const messages = data?.createThread?.messages ?? [];
    if (messages[0]?.toLowerCase().includes('success') || messages[0]?.toLowerCase().includes('created')) {
      router.push('/');
    } else {
      setError(messages[0] || 'Failed to create thread.');
    }
  };

  if (authLoading) return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>;

  if (!user) {
    return (
      <div style={{ maxWidth: 560, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, marginBottom: 16 }}>You must be logged in to post.</p>
        <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-pop)', padding: 28 }}>
        <h1 className="serif" style={{ margin: '0 0 22px', fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          Start a thread
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 9, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {categories.map((c) => (
                <CategoryPill key={c.id} name={c.name} active={categoryId === c.id} onClick={() => setCategoryId(c.id)} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clear, specific question or claim"
              required
              maxLength={150}
              className="form-input"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Make your case. Leave room for replies."
              required
              rows={6}
              className="form-input"
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
            />
          </div>

          {error && <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 13, marginBottom: 14 }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 14px',
              borderRadius: 99, border: '1px solid var(--border-strong)',
              background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--font-sans)',
              fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
            }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !categoryId}
              style={{
                display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 16px',
                borderRadius: 99, border: 'none',
                background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)',
                fontSize: 13.5, fontWeight: 600,
                opacity: loading || !categoryId ? 0.45 : 1,
              }}
            >
              {loading ? 'Posting…' : 'Post thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
