import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";
import { Query } from "./queryResolvers";
import { Mutation } from "./mutationResolvers";
import { Results } from "./resultResolvers";

const resolvers: Resolvers<ApolloContext> = {
   Query,
   Mutation,
   Results,
   // not sure if Results needs to be imported here or to Queries
}

export default resolvers;
