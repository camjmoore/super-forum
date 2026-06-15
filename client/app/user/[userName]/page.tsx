'use client';

import { use } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { GET_USER_BY_USERNAME } from '@/graphql/queries';
import type { GetUserByUserNameQuery, GetUserByUserNameQueryVariables } from '@/graphql/__generated__/graphql';

export default function UserProfilePage({ params }: { params: Promise<{ userName: string }> }) {
  const { userName } = use(params);
  const { data, loading, error } = useQuery<GetUserByUserNameQuery, GetUserByUserNameQueryVariables>(GET_USER_BY_USERNAME, {
    variables: { userName },
  });

  const result = data?.getUserByUserName;
  const user = result?.__typename === 'User' ? result : null;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];

  if (loading) return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>;
  if (error) return <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 14 }}>Error loading profile.</p>;
  if (messages?.length > 0) return <p style={{ color: 'var(--muted)' }}>{messages[0]}</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 28px', marginBottom: 24 }}>
        <h1 className="serif" style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {user.userName}
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: 'var(--muted)' }}>{user.email}</p>
        {!user.confirmed && (
          <p className="meta" style={{ margin: '8px 0 0', color: 'oklch(0.58 0.14 80)', fontSize: 11 }}>Email not confirmed</p>
        )}
      </div>

      <h2 className="meta" style={{ margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: 11, color: 'var(--muted)' }}>
        Posts ({user.threads?.length ?? 0})
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(user.threads ?? []).map((t) => (
          <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
            <Link href={`/thread/${t.id}`} className="serif" style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', lineHeight: 1.3, display: 'block' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
            >
              {t.title}
            </Link>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Link href={`/category/${t.threadCategory.id}`} className="meta" style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11, textDecoration: 'none' }}>
                {t.threadCategory.name}
              </Link>
              <span className="meta">· {t.points} pts</span>
              <span className="meta">· {(t.threadItems ?? []).length} response{(t.threadItems ?? []).length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
