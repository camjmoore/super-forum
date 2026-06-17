import {
  QueryResolvers,
  ThreadCategoryResolvers,
  ThreadCategoryArray,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const categoryQueries: Pick<
  QueryResolvers<ApolloContext>,
  'getAllCategories'
> = {
  getAllCategories: async (
    _,
    __,
    { repository: { getAllCategories } }
  ): Promise<ThreadCategoryArray> => {
    const { entities } = await getAllCategories();

    return {
      threadCategories: [...(entities || [])],
    };
  },
};

export const categoryMutations = {};

export const threadCategoryFieldResolvers: ThreadCategoryResolvers<ApolloContext> =
  {
    threads: async (parent, _, { repository }) => {
      const { entities } = await repository.getThreadsByCategoryId(parent.id);
      return entities || [];
    },
  };
