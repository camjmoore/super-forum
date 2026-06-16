'use client';

import { Suspense, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { GET_THREADS_LATEST, GET_ALL_CATEGORIES } from '@/graphql/queries';
import type { GetThreadsLatestQuery, GetThreadsLatestQueryVariables, GetAllCategoriesQuery } from '@/graphql/__generated__/graphql';
import ThreadCard from '@/components/ThreadCard';
import Panel from '@/components/Panel';

const PAGE_SIZE = 10;

const SORTS = [
  { id: 'latest', label: 'Latest' },
  { id: 'top', label: 'Top' },
  { id: 'discussed', label: 'Most discussed' },
] as const;

type SortId = typeof SORTS[number]['id'];

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [offset, setOffset] = useState(0);

  const q = searchParams.get('q') ?? '';
  const sort = (searchParams.get('sort') ?? 'latest') as SortId;

  const setParam = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set(key, val); else params.delete(key);
    router.push(pathname + (params.toString() ? '?' + params.toString() : ''), { scroll: false });
  }, [searchParams, router, pathname]);

  const { data, loading, error, refetch } = useQuery<GetThreadsLatestQuery, GetThreadsLatestQueryVariables>(GET_THREADS_LATEST, {
    variables: { limit: PAGE_SIZE, offset },
    fetchPolicy: 'cache-and-network',
  });
  const { data: catData } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES);

  const result = data?.getThreadsLatest;
  const rawThreads = result?.__typename === 'ThreadArray' ? (result.threads ?? []) : [];
  const totalCount = result?.__typename === 'ThreadArray' ? (result.totalCount ?? 0) : 0;
  const categories = catData?.getAllCategories?.threadCategories ?? [];

  const threads = useMemo(() => {
    let list = [...rawThreads];
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter((t) =>
        (t.title + ' ' + t.body + ' ' + t.user.userName).toLowerCase().includes(lq)
      );
    }
    if (sort === 'top') list.sort((a, b) => b.points - a.points);
    else if (sort === 'discussed') list.sort((a, b) => (b.threadItems?.length ?? 0) - (a.threadItems?.length ?? 0));
    return list;
  }, [rawThreads, q, sort]);

  const topThreads = useMemo(() =>
    [...rawThreads].sort((a, b) => b.points - a.points).slice(0, 4),
    [rawThreads]
  );

  const handlePage = (newOffset: number) => {
    setOffset(newOffset);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="serif" style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Latest threads
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>
              {q.trim() ? `${threads.length} result${threads.length !== 1 ? 's' : ''} for "${q.trim()}"` : 'Ideas worth keeping, in the open.'}
            </p>
          </div>

          {/* Sort pills */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 99, padding: 3 }}>
            {SORTS.map((s) => (
              <button key={s.id} onClick={() => setParam('sort', s.id === 'latest' ? '' : s.id)}
                style={{
                  border: 'none', borderRadius: 99, padding: '6px 13px', fontSize: 13, fontWeight: 500,
                  fontFamily: 'var(--font-sans)', transition: 'all .15s', cursor: 'pointer',
                  background: sort === s.id ? 'var(--surface)' : 'transparent',
                  color: sort === s.id ? 'var(--ink)' : 'var(--muted)',
                  boxShadow: sort === s.id ? 'var(--shadow-card)' : 'none',
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}
        {error && <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 14 }}>Error loading threads.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {threads.length === 0 && !loading && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)' }}>
              <p className="serif" style={{ fontSize: 18, margin: 0 }}>Nothing here yet.</p>
              <p style={{ fontSize: 14, margin: '6px 0 0' }}>Try a different search or sort.</p>
            </div>
          )}
          {threads.map((t, i) => (
            <ThreadCard
              key={t.id}
              thread={t as Parameters<typeof ThreadCard>[0]['thread']}
              index={i}
              refetch={refetch}
            />
          ))}
        </div>

        {totalCount > PAGE_SIZE && !q.trim() && (
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

      {/* Sidebar */}
      <aside style={{ width: 264, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Panel title="About Noema">
          <p className="serif" style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
            &ldquo;The object of thought.&rdquo; A quiet place to think in public — post the half-formed idea, get it sharpened.
          </p>
        </Panel>

        <Panel title="Categories">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '-4px 0' }}>
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.id}`} style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', background: 'transparent', border: 'none',
                    borderRadius: 7, padding: '7px 9px', textAlign: 'left', cursor: 'pointer',
                    transition: 'background .12s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{c.name}</span>
                </button>
              </Link>
            ))}
          </div>
        </Panel>

        {topThreads.length > 0 && (
          <Panel title="Most points">
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 13 }}>
              {topThreads.map((t, i) => (
                <li key={t.id} style={{ display: 'flex', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--faint)', width: 14, flexShrink: 0, paddingTop: 1 }}>{i + 1}</span>
                  <Link href={`/thread/${t.id}`}
                    style={{ fontSize: 14, lineHeight: 1.35, color: 'var(--ink-soft)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textDecoration: 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'; }}
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ol>
          </Panel>
        )}
      </aside>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}>
      <HomeContent />
    </Suspense>
  );
}
