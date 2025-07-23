import {
  Thread,
  EntityResult,
  MutationResolvers,
} from '../types/resolvers-types.generated';
import { register, login, logout } from '../repository/UserRepo';
import { QuerySingleResult, QueryArrayResult } from '../repository/QueryResult';
import {
  UserResult,
  ThreadResult,
  ThreadArrayResult,
  ThreadItemResult,
  ThreadItemArrayResult,
} from './resultResolvers';

export const Mutation: MutationResolvers = {
  // ts convention to underscore unused args
  // graphql convention to omit remaining unused args
  createThread: async (
    _,
    { userId, categoryId, title, body },
    { repository: { createThread } }
  ): Promise<EntityResult> => {
    const { messages } = await createThread(userId, categoryId, title, body);
    return {
      __typename: 'EntityResult',
      messages: messages,
    };
  },
  createThreadItem: () => {
    throw new Error('Not Implemented');
  },
  register: () => {
    throw new Error('Not Implemented');
  },
  login: () => {
    throw new Error('Not Implemented');
  },
  logout: () => {
    throw new Error('Not Implemented');
  },
  updateThreadPoint: () => {
    throw new Error('Not Implemented');
  },
  updateThreadItemPoint: () => {
    throw new Error('Not Implemented');
  },
  changePassword: () => {
    throw new Error('Not Implemented');
  },
};
