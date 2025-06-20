import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";
import { Query } from "./queryResolvers";
import { Mutation } from "./mutationResolvers";

const resolvers: Resolvers<ApolloContext> = {
   Query,
   Mutation,
}

export default resolvers;
