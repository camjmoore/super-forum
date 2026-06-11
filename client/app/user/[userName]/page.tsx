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

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>;
  if (error) return <p className="text-red-500 text-sm">Error loading profile.</p>;
  if (messages?.length > 0) return <p className="text-gray-500">{messages[0]}</p>;
  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded border border-gray-200 p-5">
        <h1 className="text-xl font-bold text-gray-900">{user.userName}</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        {!user.confirmed && (
          <p className="text-xs text-yellow-600 mt-1">Email not confirmed</p>
        )}
      </div>

      <h2 className="text-sm font-semibold text-gray-700">
        Posts ({user.threads?.length ?? 0})
      </h2>

      <div className="space-y-2">
        {(user.threads ?? []).map((t) => (
          <div key={t.id} className="bg-white rounded border border-gray-200 p-4">
            <Link href={`/thread/${t.id}`} className="font-medium text-gray-900 hover:text-orange-600">
              {t.title}
            </Link>
            <div className="flex gap-3 mt-1 text-xs text-gray-400">
              <Link href={`/category/${t.threadCategory.id}`} className="hover:text-orange-500">
                {t.threadCategory.name}
              </Link>
              <span>· {t.points} points</span>
              <span>· {(t.threadItems ?? []).length} comment{(t.threadItems ?? []).length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
