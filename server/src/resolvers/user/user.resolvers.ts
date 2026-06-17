import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
  UserResult,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const userQueries: Pick<
  QueryResolvers<ApolloContext>,
  'me' | 'getUserByUserName'
> = {
  me: async (_, __, { req, repository }): Promise<UserResult> => {
    if (!req.session?.userId) {
      return { messages: ['User not authenticated'] };
    }

    const result = await repository.getUserById(req.session.userId);

    if (result.user) {
      return result.user;
    }

    return { messages: result.messages || ['User not found'] };
  },

  getUserByUserName: async (
    _,
    { userName },
    { repository }
  ): Promise<UserResult> => {
    const result = await repository.getUserByUserName(userName);

    if (result.user) {
      return result.user;
    }

    return { messages: result.messages || ['User not found'] };
  },
};

export const userMutations: Pick<
  MutationResolvers<ApolloContext>,
  'register' | 'login' | 'logout' | 'changePassword' | 'confirmUser'
> = {
  register: async (
    _,
    { email, userName, password },
    { repository }
  ): Promise<UserResult> => {
    const result = await repository.register(email, userName, password);

    if (result.user) {
      return result.user;
    }

    return { messages: result.messages || ['Registration failed'] };
  },

  login: async (_, { userName, password }, { req, repository }) => {
    const result = await repository.login(userName, password);

    if (result.user) {
      req.session!.userId = result.user.id;
      return `User ${userName} logged in successfully`;
    }

    return result.messages?.[0] || 'Login failed';
  },

  logout: async (_, { userName }, { req, repository }) => {
    const messages = await repository.logout(userName);
    req.session!.userId = null;
    return messages[0] || 'Logout failed';
  },

  changePassword: async (_, { newPassword }, { req, repository }) => {
    if (!req.session?.userId) {
      return 'User not authenticated';
    }

    const result = await repository.changePassword(
      req.session.userId,
      newPassword
    );

    if (result.user) {
      return 'Password changed successfully';
    }

    return result.messages?.[0] || 'Password change failed';
  },

  confirmUser: async (_, { token }, { repository }) => {
    return repository.confirmUser(token);
  },
};

export const userFieldResolvers: UserResolvers<ApolloContext> = {
  threads: async (parent, _, { repository }) => {
    const result = await repository.getUserThreads(parent.id);
    return result.entities || [];
  },

  threadItems: async (parent, _, { repository }) => {
    const result = await repository.getUserThreadItems(parent.id);
    return result.entities || [];
  },
};
