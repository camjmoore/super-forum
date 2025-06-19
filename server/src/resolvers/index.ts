import { ApolloContext } from "../types";
import { Resolvers } from "../resolvers-types.generated";

 const resolvers: Resolvers<ApolloContext> = {
    Query: {
        hello: () => "Hello World"
    }
 }

 export default resolvers;