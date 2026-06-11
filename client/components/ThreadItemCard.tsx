'use client';

import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { UPDATE_THREAD_ITEM_POINT } from '@/graphql/mutations';
import type { UpdateThreadItemPointMutation, UpdateThreadItemPointMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';

interface ThreadItem {
  id: string;
  body: string;
  points: number;
  views: number;
  createdOn: string;
  user: { id: string; userName: string };
}

export default function ThreadItemCard({ item, refetch }: { item: ThreadItem; refetch?: () => void }) {
  const { user } = useAuth();
  const [updatePoint] = useMutation<UpdateThreadItemPointMutation, UpdateThreadItemPointMutationVariables>(UPDATE_THREAD_ITEM_POINT);

  const vote = async (increment: boolean) => {
    if (!user) return;
    await updatePoint({ variables: { threadItemId: item.id, increment } });
    refetch?.();
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-4">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1 min-w-8">
          <button
            onClick={() => vote(true)}
            className="text-gray-400 hover:text-orange-500 disabled:opacity-40 text-lg leading-none"
            disabled={!user}
          >
            ▲
          </button>
          <span className="text-sm font-semibold text-gray-700">{item.points}</span>
          <button
            onClick={() => vote(false)}
            className="text-gray-400 hover:text-blue-500 disabled:opacity-40 text-lg leading-none"
            disabled={!user}
          >
            ▼
          </button>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.body}</p>
          <div className="flex gap-2 mt-2 text-xs text-gray-400">
            <Link href={`/user/${item.user.userName}`} className="hover:text-orange-500">
              {item.user.userName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
