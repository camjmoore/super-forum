'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { GET_THREADS_LATEST, GET_TOP_CATEGORY_THREADS } from '@/graphql/queries';
import type { GetThreadsLatestQuery, GetThreadsLatestQueryVariables, GetTopCategoryThreadQuery } from '@/graphql/__generated__/graphql';
import ThreadCard from '@/components/ThreadCard';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [offset, setOffset] = useState(0);
  const { data, loading, error, refetch } = useQuery<GetThreadsLatestQuery, GetThreadsLatestQueryVariables>(GET_THREADS_LATEST, {
    variables: { limit: PAGE_SIZE, offset },
    fetchPolicy: 'cache-and-network',
  });
  const { data: topData } = useQuery<GetTopCategoryThreadQuery>(GET_TOP_CATEGORY_THREADS);

  const result = data?.getThreadsLatest;
  const threads = result?.__typename === 'ThreadArray' ? (result.threads ?? []) : [];
  const totalCount = result?.__typename === 'ThreadArray' ? result.totalCount : 0;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];
  const topThreads = topData?.getTopCategoryThread ?? [];

  const handlePage = (newOffset: number) => {
    setOffset(newOffset);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex gap-6">
      {/* Main feed */}
      <div className="flex-1 min-w-0 space-y-3">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Latest Posts</h1>

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}
        {error && <p className="text-red-500 text-sm">Error loading threads.</p>}
        {messages?.length > 0 && <p className="text-gray-500 text-sm">{messages[0]}</p>}

        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t as Parameters<typeof ThreadCard>[0]['thread']} refetch={refetch} />
        ))}

        {/* Pagination */}
        {totalCount > PAGE_SIZE && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handlePage(Math.max(0, offset - PAGE_SIZE))}
              disabled={offset === 0}
              className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500 self-center">
              {offset + 1}–{Math.min(offset + PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <button
              onClick={() => handlePage(offset + PAGE_SIZE)}
              disabled={offset + PAGE_SIZE >= totalCount}
              className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-56 shrink-0 hidden lg:block">
        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Top by Category</h2>
          <ul className="space-y-2">
            {topThreads.map((t: { threadId: string; title: string; categoryName: string }) => (
              <li key={t.threadId}>
                <Link
                  href={`/thread/${t.threadId}`}
                  className="text-xs text-gray-700 hover:text-orange-600 line-clamp-2 block"
                >
                  {t.title}
                </Link>
                <span className="text-xs text-gray-400">{t.categoryName}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
