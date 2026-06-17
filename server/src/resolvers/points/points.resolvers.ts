import {
  MutationResolvers,
  ThreadPointResolvers,
  ThreadItemPointResolvers,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const pointsMutations: Pick<
  MutationResolvers<ApolloContext>,
  'updateThreadPoint' | 'updateThreadItemPoint'
> = {
  updateThreadPoint: async (
    _,
    { threadId, increment },
    { req, repository }
  ) => {
    if (!req.session?.userId) {
      return 'User not authenticated';
    }

    const messages = await repository.updateThreadPoint(
      req.session.userId,
      threadId,
      increment
    );
    return messages[0] || 'Vote operation completed';
  },

  updateThreadItemPoint: async (
    _,
    { threadItemId, increment },
    { req, repository }
  ) => {
    if (!req.session?.userId) {
      return 'User not authenticated';
    }

    const messages = await repository.updateThreadItemPoint(
      req.session.userId,
      threadItemId,
      increment
    );
    return messages[0] || 'Vote operation completed';
  },
};

export const threadPointFieldResolvers: ThreadPointResolvers<ApolloContext> = {
  user: async (parent, _, { loaders }) => {
    const userId = parent.user?.id;
    if (!userId) throw new Error('User not found');
    const user = await loaders.userLoader.load(userId);
    if (!user) throw new Error('User not found');
    return user;
  },

  thread: async (parent, _, { repository }) => {
    const threadId = parent.thread?.id;
    if (!threadId) throw new Error('Thread not found');
    const result = await repository.getThreadById(threadId);
    if (!result.entity) throw new Error('Thread not found');
    return result.entity;
  },
};

export const threadItemPointFieldResolvers: ThreadItemPointResolvers<ApolloContext> =
  {
    user: async (parent, _, { loaders }) => {
      const userId = parent.user?.id;
      if (!userId) throw new Error('User not found');
      const user = await loaders.userLoader.load(userId);
      if (!user) throw new Error('User not found');
      return user;
    },

    threadItem: async (parent, _, { repository }) => {
      const threadItemId = parent.threadItem?.id;
      if (!threadItemId) throw new Error('Thread item not found');
      const result = await repository.getThreadItemById(threadItemId);
      if (!result.entity) throw new Error('Thread item not found');
      return result.entity;
    },
  };
