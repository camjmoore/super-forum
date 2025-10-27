import { ApolloContext } from '../types/IApolloContext';
import { Resolvers } from '../types/resolvers-types.generated';

// Import domain-specific resolvers
import {
  userQueries,
  userMutations,
  userFieldResolvers,
} from './user/user.resolvers';
import {
  threadQueries,
  threadMutations,
  threadFieldResolvers,
} from './thread/thread.resolvers';
import {
  threadItemQueries,
  threadItemMutations,
  threadItemFieldResolvers,
} from './threadItem/threadItem.resolvers';
import {
  categoryQueries,
  categoryMutations,
  threadCategoryFieldResolvers,
} from './category/category.resolvers';
import {
  pointsMutations,
  threadPointFieldResolvers,
  threadItemPointFieldResolvers,
} from './points/points.resolvers';

// Import union type resolvers
import {
  UserResult,
  ThreadResult,
  ThreadArrayResult,
  ThreadItemResult,
  ThreadItemArrayResult,
} from './unions';

// Aggregate all resolvers by type
const resolvers: Resolvers<ApolloContext> = {
  // Top-level Query resolvers from all domains
  Query: {
    ...userQueries,
    ...threadQueries,
    ...threadItemQueries,
    ...categoryQueries,
  },

  // Top-level Mutation resolvers from all domains
  Mutation: {
    ...userMutations,
    ...threadMutations,
    ...threadItemMutations,
    ...categoryMutations,
    ...pointsMutations,
  },

  // Field resolvers for complex types
  User: userFieldResolvers,
  Thread: threadFieldResolvers,
  ThreadItem: threadItemFieldResolvers,
  ThreadCategory: threadCategoryFieldResolvers,
  ThreadPoint: threadPointFieldResolvers,
  ThreadItemPoint: threadItemPointFieldResolvers,

  // Union type resolvers
  UserResult,
  ThreadResult,
  ThreadArrayResult,
  ThreadItemResult,
  ThreadItemArrayResult,
};

export default resolvers;
