import {
  UserResultResolvers,
  ThreadResultResolvers,
  ThreadArrayResultResolvers,
  ThreadItemResultResolvers,
  ThreadItemArrayResultResolvers,
} from '../types/resolvers-types.generated';

export const UserResult: UserResultResolvers = {
  __resolveType(obj: any) {
    if (obj.user) return 'User';
    if (obj.messages) return 'EntityResult';
    return null;
  },
};

export const ThreadResult: ThreadResultResolvers = {
  __resolveType(obj: any) {
    if (obj.entity && obj.entity.title) return 'Thread';
    if (obj.messages) return 'EntityResult';
    return null;
  },
};

export const ThreadArrayResult: ThreadArrayResultResolvers = {
  __resolveType(obj: any) {
    if (obj.entities) return 'ThreadArray';
    if (obj.messages) return 'EntityResult';
    return null;
  },
};

export const ThreadItemResult: ThreadItemResultResolvers = {
  __resolveType(obj: any) {
    if (obj.entity && obj.entity.body) return 'ThreadItem';
    if (obj.messages) return 'EntityResult';
    return null;
  },
};

export const ThreadItemArrayResult: ThreadItemArrayResultResolvers = {
  __resolveType(obj: any) {
    if (obj.entities) return 'ThreadItemArray';
    if (obj.messages) return 'EntityResult';
    return null;
  },
};
