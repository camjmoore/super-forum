import { QueryResolvers, ThreadResult, ThreadArrayResult, ThreadItemArrayResult, ThreadCategoryArray } from "../resolvers-types.generated";
import { getThreadById, getThreadsByCategoryId, getThreadsLatest, getThreadItemByThreadId, getAllCategories } from "../repository/ThreadRepo";


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
            threads: [...entities],
         };
      }

      return {
         __typename: 'EntityResult',
         messages
      }
   },
   getThreadsLatest: async (): Promise<ThreadArrayResult> => {
      const { entities, messages } = await getThreadsLatest();

      if (entities) {
         return {
            __typename: 'ThreadArray',
            threads: [...entities]
         };
      }

      return {
         __typename: 'EntityResult',
         messages
      }

   },
   getThreadItemByThreadId: async (_, { threadId }): Promise<ThreadItemArrayResult> => {
      const { entities, messages } = await getThreadItemByThreadId(threadId);

      if (entities) {
         return {
            __typename: 'ThreadItemArray',
            threadItems: [...entities]
         }
      }

      return {
         __typename: 'EntityResult',
         messages
      }

   },
   getAllCategories: async (): Promise<ThreadCategoryArray> => {
      const { entities } = await getAllCategories()

      return {
         __typename: 'ThreadCategoryArray',
         threadCategories: [...(entities || [])]
      }

   },
   me: () => { throw new Error('Not Implemented')},
   getTopCategoryThread: () => { throw new Error('Not Implemented')},

}


