'use client';

import { use, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { GET_THREADS_BY_CATEGORY } from '@/graphql/queries';
import type { GetThreadsByCategoryQuery, GetThreadsByCategoryQueryVariables } from '@/graphql/__generated__/graphql';
import ThreadCard from '@/components/ThreadCard';
import { BackIcon } from '@/components/Icon';

const PAGE_SIZE = 10;

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery<GetThreadsByCategoryQuery, GetThreadsByCategoryQueryVariables>(GET_THREADS_BY_CATEGORY, {
    variables: { categoryId: id, limit: PAGE_SIZE, offset },
    fetchPolicy: 'cache-and-network',
  });

  const result = data?.getThreadsByCategoryId;
  const threads = result?.__typename === 'ThreadArray' ? (result.threads ?? []) : [];
  const totalCount = result?.__typename === 'ThreadArray' ? (result.totalCount ?? 0) : 0;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];
  const categoryName = threads?.[0]?.threadCategory?.name ?? 'Category';

  const handlePage = (newOffset: number) => {
    setOffset(newOffset);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
      >
        <BackIcon /> All threads
      </Link>

      <div style={{ marginBottom: 20 }}>
        <h1 className="serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
          {categoryName}
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>Threads in this category</p>
      </div>

      {loading && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}
      {error && <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 14 }}>Error loading threads.</p>}
      {messages?.length > 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>{messages[0]}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {threads.map((t, i) => (
          <ThreadCard key={t.id} thread={t as Parameters<typeof ThreadCard>[0]['thread']} index={i} refetch={refetch} />
        ))}
      </div>

      {totalCount > PAGE_SIZE && (
        <div style={{ display: 'flex', gap: 8, marginTop: 20, alignItems: 'center' }}>
          <button
            onClick={() => handlePage(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0}
            style={{ padding: '6px 14px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', opacity: offset === 0 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            {offset + 1}–{Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount}
          </span>
          <button
            onClick={() => handlePage(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= totalCount}
            style={{ padding: '6px 14px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--ink)', cursor: 'pointer', opacity: offset + PAGE_SIZE >= totalCount ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
