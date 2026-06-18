import {
  QueryResolvers,
  MutationResolvers,
  ThreadResolvers,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const threadQueries: Pick<
  QueryResolvers<ApolloContext>,
  | 'getThreadById'
  | 'getThreadsByCategoryId'
  | 'getThreadsLatest'
  | 'getTopCategoryThread'
> = {
  getThreadById: async (_, { threadId }, { repository: { getThreadById } }) => {
    const { entity, messages } = await getThreadById(threadId);

    if (entity) {
      return entity;
    }

    return { messages };
  },

  getThreadsByCategoryId: async (
    _,
    { categoryId, limit, offset },
    { repository: { getThreadsByCategoryId } }
  ) => {
    const { entities, messages, count } = await getThreadsByCategoryId(
      categoryId,
      limit ?? 10,
      offset ?? 0
    );

    if (entities) {
      return {
        threads: [...entities],
        totalCount: count ?? entities.length,
      };
    }

    return { messages };
  },

  getThreadsLatest: async (
    _,
    { limit, offset },
    { repository: { getThreadsLatest } }
  ) => {
    const { entities, messages, count } = await getThreadsLatest(
      limit ?? 10,
      offset ?? 0
    );

    if (entities) {
      return {
        threads: [...entities],
        totalCount: count ?? entities.length,
      };
    }

    return { messages };
  },

  getTopCategoryThread: async (_, __, { repository }) => {
    const result = await repository.getTopCategoryThreads();
    return result.entities || [];
  },
};

export const threadMutations: Pick<
  MutationResolvers<ApolloContext>,
  'createThread'
> = {
  createThread: async (
    _,
    { categoryId, title, body },
    { req, repository: { createThread } }
  ) => {
    if (!req.session?.userId) {
      return { messages: ['You must be logged in to create a thread'] };
    }

    const { messages } = await createThread(
      req.session.userId,
      categoryId,
      title,
      body
    );

    return { messages };
  },
};

export const threadFieldResolvers: ThreadResolvers<ApolloContext> = {
  user: async (parent, _, { loaders }) => {
    const userId = parent.user?.id;
    if (!userId) throw new Error('User not found');
    const user = await loaders.userLoader.load(userId);
    if (!user) throw new Error('User not found');
    return user;
  },

  threadCategory: async (parent, _, { loaders }) => {
    const categoryId = parent.threadCategory?.id;
    if (!categoryId) throw new Error('Thread category not found');
    const category = await loaders.categoryLoader.load(categoryId);
    if (!category) throw new Error('Thread category not found');
    return category;
  },

  threadItems: async (parent, _, { loaders }) => {
    return loaders.threadItemsLoader.load(parent.id);
  },
};
