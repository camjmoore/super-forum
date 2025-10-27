import {
  QueryResolvers,
  MutationResolvers,
  UserResolvers,
  UserResult,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

// User Query Resolvers
export const userQueries: Pick<QueryResolvers<ApolloContext>, 'me'> = {
  me: async (_, __, { req, repository }): Promise<UserResult> => {
    if (!req.session?.userId) {
      return {
        __typename: 'EntityResult',
        messages: ['User not authenticated'],
      };
    }

    const result = await repository.getUserById(req.session.userId);

    if (result.user) {
      return {
        __typename: 'User',
        ...result.user,
      };
    }

    return {
      __typename: 'EntityResult',
      messages: result.messages || ['User not found'],
    };
  },
};

// User Mutation Resolvers
export const userMutations: Pick<
  MutationResolvers<ApolloContext>,
  'register' | 'login' | 'logout' | 'changePassword'
> = {
  register: async (
    _,
    { email, userName, password },
    { repository }
  ): Promise<UserResult> => {
    const result = await repository.register(email, userName, password);

    if (result.user) {
      return {
        __typename: 'User',
        ...result.user,
      };
    }

    return {
      __typename: 'EntityResult',
      messages: result.messages || ['Registration failed'],
    };
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
};

// User Field Resolvers - for resolving related data
export const userFieldResolvers: UserResolvers<ApolloContext> = {
  threads: async (parent, _, { repository }) => {
    const result = await repository.getUserThreads(parent.id);
    return result.entities || [];
  },

  threadItems: async (parent, _, { repository }) => {
    const result = await repository.getUserThreadItems(parent.id);
    return result.entities || [];
  },

  // Other fields are automatically resolved by GraphQL
  id: (parent) => parent.id,
  email: (parent) => parent.email,
  userName: (parent) => parent.userName,
  password: (parent) => parent.password,
  confirmed: (parent) => parent.confirmed,
  isDisabled: (parent) => parent.isDisabled,
  createdBy: (parent) => parent.createdBy,
  createdOn: (parent) => parent.createdOn,
  lastModifiedBy: (parent) => parent.lastModifiedBy,
  lastModifiedOn: (parent) => parent.lastModifiedOn,
};
