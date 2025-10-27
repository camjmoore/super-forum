import {
  QueryResolvers,
  ThreadCategoryResolvers,
  ThreadCategoryArray,
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

// Category Query Resolvers
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
      __typename: 'ThreadCategoryArray',
      threadCategories: [...(entities || [])],
    };
  },
};

// Category Mutation Resolvers (for future CRUD operations)
export const categoryMutations = {
  // Future implementations:
};

// ThreadCategory Field Resolvers - for resolving related data
export const threadCategoryFieldResolvers: ThreadCategoryResolvers<ApolloContext> =
  {
    threads: async (parent, _, { repository }) => {
      const { entities } = await repository.getThreadsByCategoryId(parent.id);
      return entities || [];
    },

    // Other fields are automatically resolved by GraphQL
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    description: (parent) => parent.description ?? null,
    createdBy: (parent) => parent.createdBy,
    createdOn: (parent) => parent.createdOn,
    lastModifiedBy: (parent) => parent.lastModifiedBy,
    lastModifiedOn: (parent) => parent.lastModifiedOn,
  };
