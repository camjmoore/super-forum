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
      return {
        __typename: 'Thread',
        ...entity,
      };
    }

    return {
      __typename: 'EntityResult',
      messages,
    };
  },

  getThreadsByCategoryId: async (
    _,
    { categoryId },
    { repository: { getThreadsByCategoryId } }
  ) => {
    const { entities, messages } = await getThreadsByCategoryId(categoryId);

    if (entities) {
      return {
        __typename: 'ThreadArray',
        threads: [...entities],
      };
    }

    return {
      __typename: 'EntityResult',
      messages,
    };
  },

  getThreadsLatest: async (_, __, { repository: { getThreadsLatest } }) => {
    const { entities, messages } = await getThreadsLatest();

    if (entities) {
      return {
        __typename: 'ThreadArray',
        threads: [...entities],
      };
    }

    return {
      __typename: 'EntityResult',
      messages,
    };
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
        return {
            __typename: 'EntityResult',
            messages: ['You must be logged in to create a thread'],
        };
    }
            
    const { messages } = await createThread(req.session.userId, categoryId, title, body);
            
    return {
      __typename: 'EntityResult',
      messages: messages,
    };
  },
};

// Thread Field Resolvers - for resolving related data
export const threadFieldResolvers: ThreadResolvers<ApolloContext> = {
  user: async (parent, _, { req, repository }) => {
    const userId = parent.user?.id ?? req.session.userId;
    if (!userId) {
      throw new Error('User not found');
    }
    const result = await repository.getUserById(userId);
    if (!result.user) {
      throw new Error('User not found');
    }
    return result.user;
  },

  threadCategory: async (parent, _, { repository }) => {
    const categoryId = parent.threadCategory?.id;
    if (!categoryId) {
      throw new Error('Thread category not found');
    }
    const result = await repository.getCategoryById(categoryId);
    if (!result.entity) {
      throw new Error('Thread category not found');
    }
    return result.entity;
  },

  threadItems: async (parent, _, { repository }) => {
    const result = await repository.getThreadItemByThreadId(parent.id);
    return result.entities || [];
  },

  // Other fields are automatically resolved by GraphQL
  id: (parent) => parent.id,
  views: (parent) => parent.views,
  points: (parent) => parent.points,
  isDisabled: (parent) => parent.isDisabled,
  title: (parent) => parent.title,
  body: (parent) => parent.body,
  createdBy: (parent) => parent.createdBy,
  createdOn: (parent) => parent.createdOn,
  lastModifiedBy: (parent) => parent.lastModifiedBy,
  lastModifiedOn: (parent) => parent.lastModifiedOn,
};
