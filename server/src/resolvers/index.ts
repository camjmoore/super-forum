import { ApolloContext } from '../types/IApolloContext';
import { Resolvers } from '../types/resolvers-types.generated';
import { Query } from './queryResolvers';
import { Mutation } from './mutationResolvers';

const resolvers: Resolvers<ApolloContext> = {
  Query,
  Mutation,
};

export default resolvers;
