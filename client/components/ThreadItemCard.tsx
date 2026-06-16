'use client';

import Link from 'next/link';
import { UPDATE_THREAD_ITEM_POINT } from '@/graphql/mutations';
import { useVote } from '@/hooks/useVote';
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
  const { displayPoints, userVote, handleVote, disabled } = useVote(
    UPDATE_THREAD_ITEM_POINT,
    (increment) => ({ threadItemId: item.id, increment }),
    item.points,
    refetch,
  );

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
        points={displayPoints}
        onUp={() => handleVote('up')}
        onDown={() => handleVote('down')}
        disabled={disabled}
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
