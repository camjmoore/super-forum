import { ApolloContext } from "../types";
import { Thread, EntityResult, MutationResolvers } from "../resolvers-types.generated";
import { register, login, logout }  from "./repository/UserRepo";
import { createThread, getThreadsByCategoryId }  from "..ThreadRepo/repository/ThreadRepo";
import { QuerySingleResult, QueryArrayResult } from "../repository/QueryResult";
import { 
   UserResult,
   ThreadResult,
   ThreadArrayResult,
   ThreadItemResult,
   ThreadItemArrayResult,
 } from "./resultResolvers";

export const Mutation: MutationResolvers = {
   // ts convention to underscore the unused args positioned in front of the one you are consuming
   // graphql convention to omit remaining args if unused
   createThread: async (_, args: { userId: string; categoryId: string; title: string; body: string; }
   ): Promise<EntityResult> => {
      let result: QuerySingleResult<Thread>;

      try {
         result = await createThread(args.userId, args.categoryId, args.title, args.body);

         return {
            messages: result.messages
               ? result.messages
               : ["An error has occurred"],
         };
      } catch (ex) {
         //maybe expand on this with some additional logging rather than rethrowing the 
         throw ex;
      }
   },
   createThreadItem: () => { throw new Error('Not Implemented')},
   register: () => { throw new Error('Not Implemented')},
   login: () => { throw new Error('Not Implemented')},
   logout: () => { throw new Error('Not Implemented')},
   updateThreadPoint: () => { throw new Error('Not Implemented')},
   updateThreadItemPoint: () => { throw new Error('Not Implemented')},
   changePassword: () => { throw new Error('Not Implemented')},
}
