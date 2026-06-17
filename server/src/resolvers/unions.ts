import {
  UserResultResolvers,
  ThreadResultResolvers,
  ThreadArrayResultResolvers,
  ThreadItemResultResolvers,
  ThreadItemArrayResultResolvers,
} from '../types/resolvers-types.generated';

export const UserResult: UserResultResolvers = {
  __resolveType(obj: any) {
    if ('userName' in obj) return 'User';
    if ('messages' in obj) return 'EntityResult';
    return null;
  },
};

export const ThreadResult: ThreadResultResolvers = {
  __resolveType(obj: any) {
    if ('title' in obj) return 'Thread';
    if ('messages' in obj) return 'EntityResult';
    return null;
  },
};

export const ThreadArrayResult: ThreadArrayResultResolvers = {
  __resolveType(obj: any) {
    if ('threads' in obj) return 'ThreadArray';
    if ('messages' in obj) return 'EntityResult';
    return null;
  },
};

export const ThreadItemResult: ThreadItemResultResolvers = {
  __resolveType(obj: any) {
    if ('body' in obj) return 'ThreadItem';
    if ('messages' in obj) return 'EntityResult';
    return null;
  },
};

export const ThreadItemArrayResult: ThreadItemArrayResultResolvers = {
  __resolveType(obj: any) {
    if ('threadItems' in obj) return 'ThreadItemArray';
    if ('messages' in obj) return 'EntityResult';
    return null;
  },
};
