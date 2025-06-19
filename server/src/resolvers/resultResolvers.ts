import { ApolloContext } from "../types";
import { 
  UserResultResolvers,
  ThreadResultResolvers,
  ThreadArrayResultResolvers,
  ThreadItemResultResolvers,
  ThreadItemArrayResultResolvers,
} from "../resolvers-types.generated";

export const UserResult: UserResultResolvers<ApolloContext> = {
   __resolveType(obj: any) {
      if (obj.user) return 'User';
      if (obj.messages) return 'EntityResult';
      return null;
   }
}

export const ThreadResult: ThreadResultResolvers<ApolloContext> = {
   __resolveType(obj: any) {
      if (obj.entity && obj.entity.title) return 'Thread';
      if (obj.messages) return 'EntityResult';
      return null;
   }
}

export const ThreadArrayResult: ThreadArrayResultResolvers<ApolloContext> = {
   __resolveType(obj: any) {
      if (obj.entities) return 'ThreadArray';
      if (obj.messages) return 'EntityResult';
      return null;
   }
}

export const ThreadItemResult: ThreadItemResultResolvers<ApolloContext> = {
   __resolveType(obj: any) {
      if (obj.entity && obj.entity.body) return 'ThreadItem';
      if (obj.messages) return 'EntityResult';
      return null;
   }
}

export const ThreadItemArrayResult: ThreadItemArrayResultResolvers<ApolloContext> = {
   __resolveType(obj: any) {
      if (obj.entities) return 'ThreadItemArray';
      if (obj.messages) return 'EntityResult';
      return null;
   }
}
