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
    <div className="max-w-sm mx-auto mt-10 bg-white rounded border border-gray-200 p-6 text-center">
      {!message && <p className="text-gray-500 text-sm">Confirming your account…</p>}
      {message && (
        <>
          <p className={`text-sm mb-4 ${confirmed ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          {confirmed && (
            <Link href="/login" className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
              Log In
            </Link>
          )}
        </>
      )}
    </div>
  );
}
