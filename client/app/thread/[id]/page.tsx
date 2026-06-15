'use client';

import { use, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { GET_THREAD_BY_ID } from '@/graphql/queries';
import { CREATE_THREAD_ITEM, UPDATE_THREAD_POINT } from '@/graphql/mutations';
import type { GetThreadByIdQuery, GetThreadByIdQueryVariables, CreateThreadItemMutation, CreateThreadItemMutationVariables, UpdateThreadPointMutation, UpdateThreadPointMutationVariables } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';
import ThreadItemCard from '@/components/ThreadItemCard';
import VoteRail from '@/components/VoteRail';
import { BackIcon, BookmarkIcon, ShareIcon, EyeIcon } from '@/components/Icon';
import { timeAgo, compact } from '@/lib/utils';

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', height: 32, padding: '0 12px',
  borderRadius: 99, border: '1px solid var(--border-strong)',
  background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--font-sans)',
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
};

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', height: 32, padding: '0 14px',
  borderRadius: 99, border: 'none',
  background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)',
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [replyBody, setReplyBody] = useState('');
  const [replyFocus, setReplyFocus] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [commentSort, setCommentSort] = useState<'top' | 'new'>('top');
  const [threadVote, setThreadVote] = useState<'up' | 'down' | null>(null);
  const [localPoints, setLocalPoints] = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery<GetThreadByIdQuery, GetThreadByIdQueryVariables>(GET_THREAD_BY_ID, {
    variables: { threadId: id },
    fetchPolicy: 'cache-and-network',
  });

  const [createThreadItem, { loading: replying }] = useMutation<CreateThreadItemMutation, CreateThreadItemMutationVariables>(CREATE_THREAD_ITEM);
  const [updatePoint] = useMutation<UpdateThreadPointMutation, UpdateThreadPointMutationVariables>(UPDATE_THREAD_POINT);

  const result = data?.getThreadById;
  const thread = result?.__typename === 'Thread' ? result : null;
  const messages = result?.__typename === 'EntityResult' ? (result.messages ?? []) : [];

  const displayPoints = localPoints !== null ? localPoints : (thread?.points ?? 0);

  const handleThreadVote = async (dir: 'up' | 'down') => {
    if (!user || !thread) return;
    const next = threadVote === dir ? null : dir;
    const increment = dir === 'up';
    setThreadVote(next);
    setLocalPoints((p) => {
      const base = p !== null ? p : thread.points;
      if (next === null) return base + (dir === 'up' ? -1 : 1);
      if (threadVote !== null) return base + (dir === 'up' ? 2 : -2);
      return base + (dir === 'up' ? 1 : -1);
    });
    await updatePoint({ variables: { threadId: thread.id, increment } });
    refetch();
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError('');
    const { data: res } = await createThreadItem({ variables: { threadId: id, body: replyBody } });
    const msg = res?.createThreadItem?.messages?.[0] ?? '';
    if (msg.toLowerCase().includes('success') || msg.toLowerCase().includes('created')) {
      setReplyBody('');
      setReplyFocus(false);
      refetch();
    } else {
      setReplyError(msg || 'Failed to post reply.');
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>;
  if (error) return <p style={{ color: 'oklch(0.55 0.18 25)', fontSize: 14 }}>Error loading thread.</p>;
  if (messages?.length > 0) return <p style={{ color: 'var(--muted)' }}>{messages[0]}</p>;
  if (!thread) return null;

  const sortedItems = [...(thread.threadItems ?? [])].sort((a, b) =>
    commentSort === 'top'
      ? b.points - a.points
      : new Date(b.createdOn as string).getTime() - new Date(a.createdOn as string).getTime()
  );

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeUp .4s ease both' }}>
      {/* Back */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 0 16px', color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
      >
        <BackIcon /> All threads
      </Link>

      {/* Thread article */}
      <article style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '26px 28px' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ paddingTop: 4 }}>
            <VoteRail
              points={displayPoints}
              onUp={() => handleThreadVote('up')}
              onDown={() => handleThreadVote('down')}
              disabled={!user}
              size="md"
              userVote={threadVote}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
              <Link href={`/category/${thread.threadCategory.id}`} className="meta"
                style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, textDecoration: 'none' }}
              >
                {thread.threadCategory.name}
              </Link>
              <span style={{ color: 'var(--faint)' }}>·</span>
              <span className="meta">{timeAgo(thread.createdOn)}</span>
            </div>

            <h1 className="serif" style={{ margin: 0, fontSize: 32, lineHeight: 1.18, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              {thread.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 11, margin: '16px 0 20px' }}>
              <div style={{ lineHeight: 1.3 }}>
                <Link href={`/user/${thread.user.userName}`} style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>
                  {thread.user.userName}
                </Link>
                <span className="meta" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <EyeIcon size={11} /> {compact(thread.views)} views
                </span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button title="Bookmark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>
                  <BookmarkIcon />
                </button>
                <button title="Share" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>
                  <ShareIcon />
                </button>
              </div>
            </div>

            <div className="serif" style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
              {thread.body.split('\n\n').map((para, i) => (
                <p key={i} style={{ margin: '0 0 1em' }}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Comments header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '28px 0 4px' }}>
        <h2 className="serif" style={{ margin: 0, fontSize: 21, fontWeight: 500, color: 'var(--ink)' }}>
          {(thread.threadItems ?? []).length} {(thread.threadItems ?? []).length === 1 ? 'response' : 'responses'}
        </h2>
        <div style={{ display: 'flex', gap: 14 }}>
          {(['top', 'new'] as const).map((s) => (
            <button key={s} onClick={() => setCommentSort(s)} className="meta"
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                color: commentSort === s ? 'var(--ink)' : 'var(--muted)',
                fontWeight: commentSort === s ? 600 : 400,
                textTransform: 'capitalize',
              }}>
              {s === 'top' ? 'Top' : 'Newest'}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      {user ? (
        <div style={{
          background: 'var(--surface)',
          border: `1px solid ${replyFocus ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: 16, margin: '14px 0 8px',
          transition: 'border-color .15s',
        }}>
          <div style={{ flex: 1 }}>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              onFocus={() => setReplyFocus(true)}
              placeholder="Add a thoughtful response…"
              rows={replyFocus || replyBody ? 3 : 1}
              className="composer-textarea"
              style={{
                width: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)', padding: '4px 0',
              }}
            />
            {(replyFocus || replyBody) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span className="meta" style={{ fontSize: 11 }}>Be generous. Be specific.</span>
                {replyError && <span style={{ color: 'oklch(0.55 0.18 25)', fontSize: 12, marginRight: 'auto', marginLeft: 12 }}>{replyError}</span>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setReplyBody(''); setReplyFocus(false); }} style={ghostBtn}>Cancel</button>
                  <button
                    onClick={handleReply}
                    disabled={!replyBody.trim() || replying}
                    style={{ ...primaryBtn, opacity: replyBody.trim() && !replying ? 1 : 0.45 }}
                  >
                    {replying ? 'Posting…' : 'Respond'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px', margin: '14px 0 8px', fontSize: 14, color: 'var(--ink-soft)' }}>
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link> to join the conversation.
        </div>
      )}

      {/* Comments list */}
      {sortedItems.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 20px', marginTop: 12 }}>
          {sortedItems.map((item, i) => (
            <ThreadItemCard
              key={item.id}
              item={item as Parameters<typeof ThreadItemCard>[0]['item']}
              index={i}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
