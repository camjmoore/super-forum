'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UPDATE_THREAD_POINT } from '@/graphql/mutations';
import { useVote } from '@/hooks/useVote';
import VoteRail from '@/components/VoteRail';
import { CommentIcon, EyeIcon } from '@/components/Icon';
import { timeAgo, compact } from '@/lib/utils';

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

export default function ThreadCard({ thread, refetch, index = 0 }: { thread: Thread; refetch?: () => void; index?: number }) {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const { displayPoints, userVote, handleVote, disabled } = useVote(
    UPDATE_THREAD_POINT,
    (increment) => ({ threadId: thread.id, increment }),
    thread.points,
    refetch,
  );

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', gap: 14, padding: '18px 20px',
        background: 'var(--surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        boxShadow: hover ? 'var(--shadow-card)' : 'none',
        transition: 'border-color .15s, box-shadow .15s, transform .15s',
        transform: hover ? 'translateY(-1px)' : 'none',
        animation: 'fadeUp .4s ease both',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <VoteRail
          points={displayPoints}
          onUp={() => handleVote('up')}
          onDown={() => handleVote('down')}
          disabled={disabled}
          size="md"
          userVote={userVote}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => router.push(`/thread/${thread.id}`)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <Link
            href={`/category/${thread.threadCategory.id}`}
            onClick={(e) => e.stopPropagation()}
            className="meta"
            style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, textDecoration: 'none' }}
          >
            {thread.threadCategory.name}
          </Link>
          <span style={{ color: 'var(--faint)' }}>·</span>
          <span className="meta">{timeAgo(thread.createdOn)}</span>
        </div>

        <h3
          className="serif"
          style={{
            margin: 0, fontSize: 20, lineHeight: 1.25, fontWeight: 500,
            color: hover ? 'var(--accent-press)' : 'var(--ink)',
            transition: 'color .15s', letterSpacing: '-0.01em',
          }}
        >
          {thread.title}
        </h3>

        <p style={{
          margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {thread.body}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 13 }}>
          <Link href={`/user/${thread.user.userName}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500, textDecoration: 'none' }}>
            {thread.user.userName}
          </Link>
          <span className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <CommentIcon style={{ color: 'var(--faint)' }} /> {thread.threadItems.length}
          </span>
          <span className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <EyeIcon style={{ color: 'var(--faint)' }} /> {compact(thread.views)}
          </span>
        </div>
      </div>
    </article>
  );
}
