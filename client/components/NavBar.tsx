'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCreateModal } from '@/context/CreateModalContext';
import { SearchIcon, PlusIcon } from '@/components/Icon';

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 36, padding: '0 14px', borderRadius: 99, border: 'none',
  background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-sans)',
  fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  height: 36, padding: '0 14px', borderRadius: 99,
  border: '1px solid var(--border-strong)',
  background: 'transparent', color: 'var(--ink)', fontFamily: 'var(--font-sans)',
  fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
};

function NavBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { open } = useCreateModal();

  const q = searchParams.get('q') ?? '';

  const setQ = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    router.push('/' + (params.toString() ? '?' + params.toString() : ''), { scroll: false });
  }, [searchParams, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'oklch(0.955 0.012 79 / 0.82)',
      backdropFilter: 'saturate(1.4) blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', gap: 22,
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 9, textDecoration: 'none' }}>
          <span className="serif" style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
            Noema
          </span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'center', transform: 'translateY(1px)', flexShrink: 0 }} />
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 380, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 12, color: 'var(--faint)', display: 'flex', pointerEvents: 'none' }}>
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search threads…"
            style={{
              width: '100%', height: 38, paddingLeft: 35, paddingRight: 12,
              background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 99,
              fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink)', outline: 'none',
              transition: 'border-color .15s, background .15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--surface)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--surface-2)'; }}
          />
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          {user ? (
            <>
              <button onClick={open} style={primaryBtn}>
                <PlusIcon size={14} /> New post
              </button>
              <Link href={`/user/${user.userName}`} style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none' }}>
                {user.userName}
              </Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={ghostBtn}>Log in</Link>
              <Link href="/register" style={primaryBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function NavBar() {
  return (
    <Suspense fallback={
      <header style={{ position: 'sticky', top: 0, zIndex: 40, height: 60, background: 'oklch(0.955 0.012 79 / 0.82)', borderBottom: '1px solid var(--border)' }} />
    }>
      <NavBarInner />
    </Suspense>
  );
}
