import { 
   QueryResolvers, 
   MutationResolvers, 
   ThreadResolvers 
} from '../../types/resolvers-types.generated';
import { ApolloContext } from '../../types/IApolloContext';

export const threadQueries: Pick<
   QueryResolvers<ApolloContext>, 
   'getThreadById' | 'getThreadsByCategoryId' | 'getThreadsLatest' | 'getTopCategoryThread'
   > = {
      getThreadById: async (_, { threadId }, {repository: { getThreadById }}) => {
         const { entity, messages } = await getThreadById(threadId);

         if (entity) {
            return {
               __typename: "Thread",
               ...entity
            };
         }

         return {
            __typename: 'EntityResult',
            messages
         };
      },

      getThreadsByCategoryId: async (_, { categoryId }, {repository: { getThreadsByCategoryId }}) => {
         const { entities, messages } = await getThreadsByCategoryId(categoryId);

         if (entities) {
            return {
               __typename: 'ThreadArray',
               threads: [...entities],
            };
         }

         return {
            __typename: 'EntityResult',
            messages
         };
      },

      getThreadsLatest: async (_, __, {repository: { getThreadsLatest }}) => {
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
         };
      },

      getTopCategoryThread: async () => {
         throw new Error('Not yet Implemented');
      }
   };

export const threadMutations: Pick<MutationResolvers<ApolloContext>, 'createThread'> = {
   createThread: async (_, { userId, categoryId, title, body }, {repository: { createThread }}) => {
      const { messages } = await createThread(userId, categoryId, title, body);
      return {
         __typename: 'EntityResult',
         messages: messages
      };
   }
};

/*export const threadFieldResolvers: ThreadResolvers<ApolloContext> = {
   user: async (parent, _, { repository }) => {
      return await repository.user.getUserById(parent.id);
   },

   threadCategory: async (parent, _, { repository }) => {
      return await repository.category.getCategoryById(parent.categoryId);
   },

   threadItems: async (parent, _, { repository }) => {
      return await repository.threadItem.getThreadItemsByThreadId(parent.id);
   }
};*/

