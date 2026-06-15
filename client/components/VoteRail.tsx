'use client';

import { useState } from 'react';
import { ChevronIcon } from '@/components/Icon';

interface VoteRailProps {
  points: number;
  onUp: () => void;
  onDown: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  userVote?: 'up' | 'down' | null;
}

export default function VoteRail({ points, onUp, onDown, disabled = false, size = 'md', userVote = null }: VoteRailProps) {
  const [bump, setBump] = useState(false);
  const dim = size === 'sm' ? 22 : 26;
  const fs = size === 'sm' ? 13 : 14;

  const click = (dir: 'up' | 'down', handler: () => void) => {
    if (disabled) return;
    handler();
    setBump(true);
    setTimeout(() => setBump(false), 240);
  };

  const chevronStyle = (dir: 'up' | 'down'): React.CSSProperties => {
    const active = userVote === dir;
    return {
      width: dim,
      height: dim,
      borderRadius: 7,
      border: 'none',
      background: active ? 'var(--accent-tint)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--faint)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      transition: 'background .15s, color .15s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <button
        onClick={() => click('up', onUp)}
        disabled={disabled}
        title="Upvote"
        style={chevronStyle('up')}
        onMouseEnter={(e) => { if (!disabled && userVote !== 'up') (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'; }}
        onMouseLeave={(e) => { if (userVote !== 'up') (e.currentTarget as HTMLElement).style.color = 'var(--faint)'; }}
      >
        <ChevronIcon size={14} dir="up" />
      </button>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: fs,
          fontWeight: 500,
          color: userVote === 'up' ? 'var(--accent)' : 'var(--ink-soft)',
          animation: bump ? 'pop .24s ease' : 'none',
          minWidth: 28,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {points}
      </span>
      <button
        onClick={() => click('down', onDown)}
        disabled={disabled}
        title="Downvote"
        style={chevronStyle('down')}
        onMouseEnter={(e) => { if (!disabled && userVote !== 'down') (e.currentTarget as HTMLElement).style.color = 'var(--ink-soft)'; }}
        onMouseLeave={(e) => { if (userVote !== 'down') (e.currentTarget as HTMLElement).style.color = 'var(--faint)'; }}
      >
        <ChevronIcon size={14} dir="down" />
      </button>
    </div>
  );
}
