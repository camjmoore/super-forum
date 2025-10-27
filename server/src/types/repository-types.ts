//import { User } from "../repository/entities/User";
import { Thread } from '../repository/entities/Thread';
//import { ThreadPoint } from "../repository/entities/ThreadPoint";
import { ThreadItem } from '../repository/entities/ThreadItem';
//import { ThreadItemPoint } from "../repository/entities/ThreadItemPoint";
import { ThreadCategory } from '../repository/entities/ThreadCategory';
import { QuerySingleResult, QueryArrayResult } from '../repository/QueryResult';
import { UserResult } from '../repository/UserRepo';

export type Repositories = {
  // ThreadRepo exports
  createThread: (
    userId: string,
    categoryId: string,
    title: string,
    body: string
  ) => Promise<{ messages?: string[] }>;
  getThreadById: (id: string) => Promise<QuerySingleResult<Thread>>;
  getThreadsByCategoryId: (
    categoryId: string
  ) => Promise<QueryArrayResult<Thread>>;
  getThreadsLatest: () => Promise<QueryArrayResult<Thread>>;
  getUserThreads: (userId: string) => Promise<QueryArrayResult<Thread>>;
  getTopCategoryThreads: () => Promise<QueryArrayResult<any>>;

  // ThreadItemRepo exports
  createThreadItem: (
    userId: string,
    threadId: string,
    body: string
  ) => Promise<QuerySingleResult<ThreadItem>>;
  getThreadItemById: (id: string) => Promise<QuerySingleResult<ThreadItem>>;
  getThreadItemByThreadId: (
    id: string
  ) => Promise<QueryArrayResult<ThreadItem>>;
  getThreadItemsByThreadId: (
    threadId: string
  ) => Promise<QueryArrayResult<ThreadItem>>;
  getUserThreadItems: (userId: string) => Promise<QueryArrayResult<ThreadItem>>;

  // CategoryRepo exports
  getAllCategories: () => Promise<QueryArrayResult<ThreadCategory>>;
  getCategoryById: (id: string) => Promise<QuerySingleResult<ThreadCategory>>;
  createCategory: (
    name: string,
    description?: string
  ) => Promise<QuerySingleResult<ThreadCategory>>;
  updateCategory: (
    id: string,
    name?: string,
    description?: string
  ) => Promise<QuerySingleResult<ThreadCategory>>;
  deleteCategory: (id: string) => Promise<QuerySingleResult<ThreadCategory>>;

  // UserRepo exports
  register: (
    email: string,
    userName: string,
    password: string
  ) => Promise<UserResult>;
  login: (userName: string, password: string) => Promise<UserResult>;
  logout: (userName: string) => Promise<Array<string>>;
  getUserById: (id: string) => Promise<UserResult>;
  changePassword: (userId: string, newPassword: string) => Promise<UserResult>;

  // PointsRepo exports
  updateThreadPoint: (
    userId: string,
    threadId: string,
    increment: boolean
  ) => Promise<string[]>;
  updateThreadItemPoint: (
    userId: string,
    threadItemId: string,
    increment: boolean
  ) => Promise<string[]>;
  //getUserByUserName: (userName: string) => Promise<UserResult>;
};
