'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';
import { UPDATE_THREAD_ITEM_POINT } from '@/graphql/mutations';
import type { UpdateThreadItemPointMutation, UpdateThreadItemPointMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';
import VoteRail from '@/components/VoteRail';
import { ReplyIcon, ShareIcon } from '@/components/Icon';
import { timeAgo } from '@/lib/utils';

interface ThreadItem {
  id: string;
  body: string;
  points: number;
  views: number;
  createdOn: string;
  user: { id: string; userName: string };
}

export default function ThreadItemCard({ item, refetch, index = 0 }: { item: ThreadItem; refetch?: () => void; index?: number }) {
  const { user } = useAuth();
  const [localPoints, setLocalPoints] = useState(item.points);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const [updatePoint] = useMutation<UpdateThreadItemPointMutation, UpdateThreadItemPointMutationVariables>(UPDATE_THREAD_ITEM_POINT);

  const handleVote = async (dir: 'up' | 'down') => {
    if (!user) return;
    const next = userVote === dir ? null : dir;
    const increment = dir === 'up';
    setUserVote(next);
    setLocalPoints((p) => {
      if (next === null) return p + (dir === 'up' ? -1 : 1);
      if (userVote !== null) return p + (dir === 'up' ? 2 : -2);
      return p + (dir === 'up' ? 1 : -1);
    });
    await updatePoint({ variables: { threadItemId: item.id, increment } });
    refetch?.();
  };

  return (
    <div
      className="comment-wrapper"
      style={{
        display: 'flex', gap: 13, padding: '16px 0',
        borderTop: index === 0 ? 'none' : '1px solid var(--border)',
        animation: 'fadeUp .35s ease both',
      }}
    >
      <VoteRail
        points={localPoints}
        onUp={() => handleVote('up')}
        onDown={() => handleVote('down')}
        disabled={!user}
        size="sm"
        userVote={userVote}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Link href={`/user/${item.user.userName}`} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>
            {item.user.userName}
          </Link>
          <span style={{ color: 'var(--faint)' }}>·</span>
          <span className="meta">{timeAgo(item.createdOn)}</span>
        </div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{item.body}</p>
        <div className="comment-actions" style={{ display: 'flex', gap: 16, marginTop: 9 }}>
          <button className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, color: 'var(--muted)', cursor: 'pointer' }}>
            <ReplyIcon /> Reply
          </button>
          <button className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, color: 'var(--muted)', cursor: 'pointer' }}>
            <ShareIcon /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
