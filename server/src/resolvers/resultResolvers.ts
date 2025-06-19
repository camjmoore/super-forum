import { QueryResolvers } from "../resolvers-types.generated";

export const Results: QueryResolvers = {
   UserResult: {
      __resolveType(obj: any) {
         if (obj.user) return 'User';
         if (obj.messages) return 'EntityResult';
         return null;
      },
   },

   ThreadResult: {
      __resolveType(obj: any) {
         if (obj.entity && obj.entity.title) return 'Thread';
         if (obj.messages) return 'EntityResult';
         return null;
      },
   },

   ThreadArrayResult: {
      __resolveType(obj: any) {
         if (obj.entities) return 'ThreadArray';
         if (obj.messages) return 'EntityResult';
         return null;
      },
   },

   ThreadItemResult: {
      __resolveType(obj: any) {
         if (obj.entity && obj.entity.body) return 'ThreadItem';
         if (obj.messages) return 'EntityResult';
         return null;
      },
   },

   ThreadItemArrayResult: {
      __resolveType(obj: any) {
         if (obj.entities) return 'ThreadItemArray';
         if (obj.messages) return 'EntityResult';
         return null;
      },
   },
}
