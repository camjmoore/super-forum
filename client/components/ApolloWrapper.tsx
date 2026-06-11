'use client';

import { ApolloProvider } from '@apollo/client/react';
import { makeApolloClient } from '@/lib/apollo-client';
import { useMemo } from 'react';

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => makeApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
