import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";
import { Query } from "./queryResolvers";
import { Mutation } from "./mutationResolvers";
import { 
  UserResult,
  ThreadResult,
  ThreadArrayResult,
  ThreadItemResult,
  ThreadItemArrayResult,
} from "./resultResolvers";

const resolvers: Resolvers<ApolloContext> = {
   Query,
   Mutation,
   UserResult,
   ThreadResult,
   ThreadArrayResult,
   ThreadItemResult,
   ThreadItemArrayResult,
}

export default resolvers;
