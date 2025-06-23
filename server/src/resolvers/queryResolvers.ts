import { QueryResolvers, ThreadResult, ThreadArrayResult } from "../resolvers-types.generated";
import { getThreadById, getThreadsByCategoryId } from "../repository/ThreadRepo";


export const Query: QueryResolvers = {
   getThreadById: async (_, { id }): Promise<ThreadResult> => {
      const { entity, messages } = await getThreadById(id)

      if (entity) {
         return {
            __typename: "Thread",
            ...entity
         }
      }

      return {
         __typename: 'EntityResult',
         messages
      }
   },
   getThreadsByCategoryId: async (_, { categoryId }): Promise<ThreadArrayResult> => {
      const { entities, messages }  = await getThreadsByCategoryId(categoryId);

      if (entities) {
         return {
            __typename: 'ThreadArray',
            ...entities
         };
      }

      return {
         __typename: 'EntityResult',
         messages
      }
   },
   getThreadsLatest: () => { throw new Error('Not Implemented')},
   getThreadItemByThreadId: () => { throw new Error('Not Implemented')},
   getAllCategories: () => { throw new Error('Not Implemented')},
   me: () => { throw new Error('Not Implemented')},
   getTopCategoryThread: () => { throw new Error('Not Implemented')},

}
