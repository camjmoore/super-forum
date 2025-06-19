import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";
import { Queries } from "./queryResolvers";

 const resolvers: Resolvers<ApolloContext> = {
    Queries
 }

 export default resolvers;
