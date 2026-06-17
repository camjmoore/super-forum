import {
  QueryResolvers,
  MutationResolvers,
  ThreadItemResolvers,
  ThreadItemArrayResult,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const threadItemQueries: Pick<
  QueryResolvers<ApolloContext>,
  'getThreadItemByThreadId'
> = {
  getThreadItemByThreadId: async (
    _,
    { threadId },
    { repository: { getThreadItemByThreadId } }
  ): Promise<ThreadItemArrayResult> => {
    const { entities, messages } = await getThreadItemByThreadId(threadId);

    if (entities) {
      return { threadItems: [...entities] };
    }

    return { messages };
  },
};

export const threadItemMutations: Pick<
  MutationResolvers<ApolloContext>,
  'createThreadItem'
> = {
  createThreadItem: async (_, { threadId, body }, { req, repository }) => {
    const userId = req.session?.userId;

    if (!userId) {
      return { messages: ['You must be logged in.'] };
    }

    const { messages } = await repository.createThreadItem(
      userId,
      threadId,
      body ?? ''
    );

    return { messages };
  },
};

export const threadItemFieldResolvers: ThreadItemResolvers<ApolloContext> = {
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
