import {
  QueryResolvers,
  MutationResolvers,
  ThreadItemResolvers,
  ThreadItemArrayResult,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

// ThreadItem Query Resolvers
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
      return {
        __typename: 'ThreadItemArray',
        threadItems: [...entities],
      };
    }

    return {
      __typename: 'EntityResult',
      messages,
    };
  },
};

// ThreadItem Mutation Resolvers
export const threadItemMutations: Pick<
  MutationResolvers<ApolloContext>,
  'createThreadItem'
> = {
  createThreadItem: async (_, { userId, threadId, body }, { repository }) => {
    const { messages } = await repository.createThreadItem(
      userId,
      threadId,
      body ?? ''
    );

    return {
      __typename: 'EntityResult',
      messages: messages,
    };
  },
};

// ThreadItem Field Resolvers - for resolving related data
export const threadItemFieldResolvers: ThreadItemResolvers<ApolloContext> = {
  user: async (parent, _, { repository }) => {
    const userId = parent.user?.id;
    if (!userId) throw new Error('User not found');
    const result = await repository.getUserById(userId);
    if (!result.user) throw new Error('User not found');
    return result.user;
  },

  thread: async (parent, _, { repository }) => {
    const threadId = parent.thread?.id;
    if (!threadId) throw new Error('Thread not found');
    const result = await repository.getThreadById(threadId);
    if (!result.entity) throw new Error('Thread not found');
    return result.entity;
  },

  // Other fields are automatically resolved by GraphQL
  id: (parent) => parent.id,
  views: (parent) => parent.views,
  points: (parent) => parent.points,
  isDisabled: (parent) => parent.isDisabled,
  body: (parent) => parent.body,
  createdBy: (parent) => parent.createdBy,
  createdOn: (parent) => parent.createdOn,
  lastModifiedBy: (parent) => parent.lastModifiedBy,
  lastModifiedOn: (parent) => parent.lastModifiedOn,
};
