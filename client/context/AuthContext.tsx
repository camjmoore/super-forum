'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { ME } from '@/graphql/queries';
import { LOGOUT } from '@/graphql/mutations';
import type { MeQuery, LogoutMutation, LogoutMutationVariables } from '@/graphql/__generated__/graphql';

interface AuthUser {
  id: string;
  userName: string;
  email: string;
  confirmed: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refetch: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const apolloClient = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const { data, loading, refetch } = useQuery<MeQuery>(ME, { fetchPolicy: 'network-only' });
  const [logoutMutation] = useMutation<LogoutMutation, LogoutMutationVariables>(LOGOUT);

  useEffect(() => {
    if (data?.me?.__typename === 'User') {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);

  const logout = async () => {
    if (user) {
      await logoutMutation({ variables: { userName: user.userName } });
    }
    setUser(null);
    await apolloClient.resetStore();
  };

  return (
    <AuthContext.Provider value={{ user, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
