'use client';

import { use, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { GET_THREAD_BY_ID } from '@/graphql/queries';
import { CREATE_THREAD_ITEM, UPDATE_THREAD_POINT } from '@/graphql/mutations';
import type { GetThreadByIdQuery, GetThreadByIdQueryVariables, CreateThreadItemMutation, CreateThreadItemMutationVariables, UpdateThreadPointMutation, UpdateThreadPointMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';
import ThreadItemCard from '@/components/ThreadItemCard';

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [replyBody, setReplyBody] = useState('');
  const [replyError, setReplyError] = useState('');

  const { data, loading, error, refetch } = useQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GET_THREAD_BY_ID, {
    variables: { threadId: id },
    fetchPolicy: 'cache-and-network',
  });

  const [createThreadItem, { loading: replying }] = useMutation<CreateThreadItemMutation, CreateThreadItemMutationVariables>(CREATE_THREAD_ITEM);
  const [updatePoint] = useMutation<UpdateThreadPointMutation, UpdateThreadPointMutationVariables>(UPDATE_THREAD_POINT);

  const result = data?.getThreadById;
  const thread = result?.__typename === 'Thread' ? result : null;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError('');
    const { data: res } = await createThreadItem({
      variables: { threadId: id, body: replyBody },
    });
    const msg = res?.createThreadItem?.messages?.[0] ?? '';
    if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('created')) {
      setReplyBody('');
      refetch();
    } else {
      setReplyError(msg || 'Failed to post reply.');
    }
  };

  const vote = async (increment: boolean) => {
    if (!user || !thread) return;
    await updatePoint({ variables: { threadId: thread.id, increment } });
    refetch();
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>;
  if (error) return <p className="text-red-500 text-sm">Error loading thread.</p>;
  if (messages?.length > 0) return <p className="text-gray-500">{messages[0]}</p>;
  if (!thread) return null;

  return (
    <div className="space-y-4">
      {/* Thread header */}
      <div className="bg-white rounded border border-gray-200 p-5">
        <div className="flex gap-3">
          {/* Vote */}
          <div className="flex flex-col items-center gap-1 min-w-8">
            <button onClick={() => vote(true)} disabled={!user} className="text-gray-400 hover:text-orange-500 disabled:opacity-40 text-lg leading-none">▲</button>
            <span className="text-sm font-semibold text-gray-700">{thread.points}</span>
            <button onClick={() => vote(false)} disabled={!user} className="text-gray-400 hover:text-blue-500 disabled:opacity-40 text-lg leading-none">▼</button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/category/${thread.threadCategory.id}`} className="text-xs text-orange-500 hover:underline">
                {thread.threadCategory.name}
              </Link>
              <span className="text-xs text-gray-400">·</span>
              <Link href={`/user/${thread.user.userName}`} className="text-xs text-gray-500 hover:underline">
                {thread.user.userName}
              </Link>
              <span className="text-xs text-gray-400">· {thread.views} views</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h1>
            <p className="text-gray-700 whitespace-pre-wrap">{thread.body}</p>
          </div>
        </div>
      </div>

      {/* Comments */}
      <h2 className="text-sm font-semibold text-gray-700">{(thread.threadItems ?? []).length} Comment{(thread.threadItems ?? []).length !== 1 ? 's' : ''}</h2>

      {(thread.threadItems ?? []).map((item) => (
        <ThreadItemCard key={item.id} item={item as Parameters<typeof ThreadItemCard>[0]['item']} refetch={refetch} />
      ))}

      {/* Reply form */}
      {user ? (
        <form onSubmit={handleReply} className="bg-white rounded border border-gray-200 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Leave a comment</h3>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply…"
            rows={4}
            required
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
          />
          {replyError && <p className="text-red-500 text-xs">{replyError}</p>}
          <button
            type="submit"
            disabled={replying || !replyBody.trim()}
            className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            {replying ? 'Posting…' : 'Post Reply'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 bg-white rounded border border-gray-200 p-4">
          <Link href="/login" className="text-orange-500 hover:underline">Log in</Link> to leave a comment.
        </p>
      )}
    </div>
  );
}
