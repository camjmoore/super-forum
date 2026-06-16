'use client';

import { use, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { CONFIRM_USER } from '@/graphql/mutations';
import type { ConfirmUserMutation, ConfirmUserMutationVariables } from '@/graphql/__generated__/graphql';

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmUser] = useMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(CONFIRM_USER);

  useEffect(() => {
    confirmUser({ variables: { token } })
      .then(({ data }) => {
        const msg: string = data?.confirmUser ?? '';
        setMessage(msg);
        setConfirmed(msg.toLowerCase().includes('successfully'));
      })
      .catch(() => setMessage('An error occurred confirming your account.'));
  }, [token, confirmUser]);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-pop)', padding: 32, textAlign: 'center' }}>
        {!message && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Confirming your account…</p>
        )}
        {message && (
          <>
            <p style={{
              fontSize: 14.5, marginBottom: 20,
              color: confirmed ? 'oklch(0.50 0.14 145)' : 'oklch(0.55 0.18 25)',
            }}>
              {message}
            </p>
            {confirmed && (
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', height: 40, padding: '0 20px',
                borderRadius: 99, border: 'none', background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}>
                Log in
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
