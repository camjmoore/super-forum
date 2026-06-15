'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_THREAD } from '@/graphql/mutations';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import type { CreateThreadMutation, CreateThreadMutationVariables, GetAllCategoriesQuery } from '@/graphql/__generated__/graphql';
import { useCreateModal } from '@/context/CreateModalContext';
import CategoryPill from '@/components/CategoryPill';
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

export default function CreateModal() {
  const { isOpen, close } = useCreateModal();
  const { user } = useAuth();
  const router = useRouter();
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const { data: catData } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES, { skip: !isOpen });
  const categories = catData?.getAllCategories?.threadCategories ?? [];

  const [createThread, { loading }] = useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CREATE_THREAD);

  useEffect(() => {
    if (isOpen) { setCategoryId(''); setTitle(''); setBody(''); setError(''); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const valid = !!(categoryId && title.trim() && body.trim());

  const handleSubmit = async () => {
    if (!valid) return;
    setError('');
    const { data } = await createThread({ variables: { categoryId, title: title.trim(), body: body.trim() } });
    const msg = data?.createThread?.messages?.[0] ?? '';
    if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('created')) {
      close();
      router.refresh();
      router.push('/');
    } else {
      setError(msg || 'Failed to create thread.');
    }
  };

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'oklch(0.3 0.02 60 / 0.34)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '8vh 20px',
        animation: 'fadeUp .2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-pop)',
          padding: 26,
        }}
      >
        <h2 className="serif" style={{ margin: '0 0 18px', fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>
          Start a thread
        </h2>

        {!user && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>You must be logged in to post.</p>
        )}

        {user && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {categories.map((c) => (
                  <CategoryPill key={c.id} name={c.name} active={categoryId === c.id} onClick={() => setCategoryId(c.id)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="A clear, specific question or claim"
                className="form-input"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="meta" style={{ display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, color: 'var(--muted)' }}>Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Make your case. Leave room for replies."
                className="form-input"
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
              />
            </div>

            {error && <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
              <button
                onClick={close}
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 14px',
                  borderRadius: 99, border: '1px solid var(--border-strong)',
                  background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--font-sans)',
                  fontSize: 13.5, fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!valid || loading}
                style={{
                  display: 'inline-flex', alignItems: 'center', height: 38, padding: '0 16px',
                  borderRadius: 99, border: 'none',
                  background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)',
                  fontSize: 13.5, fontWeight: 600,
                  opacity: valid && !loading ? 1 : 0.45,
                }}
              >
                {loading ? 'Posting…' : 'Post thread'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
