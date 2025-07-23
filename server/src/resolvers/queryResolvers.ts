import {
  QueryResolvers,
  ThreadResult,
  ThreadArrayResult,
  ThreadItemArrayResult,
  ThreadCategoryArray,
} from '../types/resolvers-types.generated';

export const Query: QueryResolvers = {
  getThreadById: async (
    _,
    { threadId },
    { repository: { getThreadById } }
  ): Promise<ThreadResult> => {
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
  ): Promise<ThreadArrayResult> => {
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
  getThreadsLatest: async (
    _,
    __,
    { repository: { getThreadsLatest } }
  ): Promise<ThreadArrayResult> => {
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
  getAllCategories: async (
    _,
    __,
    { repository: { getAllCategories } }
  ): Promise<ThreadCategoryArray> => {
    const { entities } = await getAllCategories();

    return {
      __typename: 'ThreadCategoryArray',
      threadCategories: [...(entities || [])],
    };
  },
  me: () => {
    throw new Error('Not Implemented');
  },
  getTopCategoryThread: () => {
    throw new Error('Not Implemented');
  },
};
