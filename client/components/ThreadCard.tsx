'use client';

import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { UPDATE_THREAD_POINT } from '@/graphql/mutations';
import type { UpdateThreadPointMutation, UpdateThreadPointMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';

interface Thread {
  id: string;
  title: string;
  body: string;
  views: number;
  points: number;
  createdOn: string;
  user: { id: string; userName: string };
  threadCategory: { id: string; name: string };
  threadItems: { id: string }[];
}

export default function ThreadCard({ thread, refetch }: { thread: Thread; refetch?: () => void }) {
  const { user } = useAuth();
  const [updatePoint] = useMutation<UpdateThreadPointMutation, UpdateThreadPointMutationVariables>(UPDATE_THREAD_POINT);

  const vote = async (increment: boolean) => {
    if (!user) return;
    await updatePoint({ variables: { threadId: thread.id, increment } });
    refetch?.();
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-4 hover:border-orange-300 transition-colors">
      <div className="flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 min-w-8">
          <button
            onClick={() => vote(true)}
            className="text-gray-400 hover:text-orange-500 disabled:opacity-40 text-lg leading-none"
            disabled={!user}
            title="Upvote"
          >
            ▲
          </button>
          <span className="text-sm font-semibold text-gray-700">{thread.points}</span>
          <button
            onClick={() => vote(false)}
            className="text-gray-400 hover:text-blue-500 disabled:opacity-40 text-lg leading-none"
            disabled={!user}
            title="Downvote"
          >
            ▼
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/thread/${thread.id}`} className="text-base font-semibold text-gray-900 hover:text-orange-600 line-clamp-2">
            {thread.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{thread.body}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <Link href={`/category/${thread.threadCategory.id}`} className="hover:text-orange-500">
              {thread.threadCategory.name}
            </Link>
            <span>·</span>
            <Link href={`/user/${thread.user.userName}`} className="hover:text-orange-500">
              {thread.user.userName}
            </Link>
            <span>·</span>
            <span>{thread.threadItems.length} comment{thread.threadItems.length !== 1 ? 's' : ''}</span>
            <span>·</span>
            <span>{thread.views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
