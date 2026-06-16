'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type { DocumentNode } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';

export function useVote(
  mutationDoc: DocumentNode,
  buildVariables: (increment: boolean) => Record<string, unknown>,
  initialPoints: number,
  onSuccess?: () => void,
) {
  const { user } = useAuth();
  const [localPoints, setLocalPoints] = useState<number | null>(null);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [mutate] = useMutation(mutationDoc);

  const displayPoints = localPoints ?? initialPoints;

  const handleVote = async (dir: 'up' | 'down') => {
    if (!user) return;
    const next = userVote === dir ? null : dir;
    const prevVote = userVote;
    // Toggle-off reverses direction; fresh/switch uses the chosen direction
    const increment = next === null ? dir !== 'up' : dir === 'up';
    setUserVote(next);
    setLocalPoints((p) => {
      const base = p ?? initialPoints;
      if (next === null) return base + (dir === 'up' ? -1 : 1);
      if (prevVote !== null) return base + (dir === 'up' ? 2 : -2);
      return base + (dir === 'up' ? 1 : -1);
    });
    await mutate({ variables: buildVariables(increment) });
    onSuccess?.();
  };

  return { displayPoints, userVote, handleVote, disabled: !user };
}
