'use client';

import { use, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_THREADS_BY_CATEGORY } from '@/graphql/queries';
import type { GetThreadsByCategoryQuery, GetThreadsByCategoryQueryVariables } from '@/graphql/__generated__/graphql';
import ThreadCard from '@/components/ThreadCard';

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
  const totalCount = result?.__typename === 'ThreadArray' ? result.totalCount : 0;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];
  const categoryName = threads?.[0]?.threadCategory?.name ?? 'Category';

  const handlePage = (newOffset: number) => {
    setOffset(newOffset);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">{categoryName}</h1>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {error && <p className="text-red-500 text-sm">Error loading threads.</p>}
      {messages?.length > 0 && <p className="text-gray-500 text-sm">{messages[0]}</p>}

      <div className="space-y-3">
        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t as Parameters<typeof ThreadCard>[0]['thread']} refetch={refetch} />
        ))}
      </div>

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
  );
}
