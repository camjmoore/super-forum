import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";
import { Queries } from "./queryResolvers";
import { Mutations } from "./mutationResolvers";
import { Results } from "./resultResolvers";

const resolvers: Resolvers<ApolloContext> = {
   Queries,
   Mutations,
   Results,
   // not sure if Results needs to be imported here or to Queries
}

export default resolvers;
