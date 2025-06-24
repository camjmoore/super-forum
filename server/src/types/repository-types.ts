//import { User } from "../repository/entities/User";
import { Thread } from "../repository/entities/Thread";
//import { ThreadPoint } from "../repository/entities/ThreadPoint";
import { ThreadItem } from "../repository/entities/ThreadItem";
//import { ThreadItemPoint } from "../repository/entities/ThreadItemPoint";
import { ThreadCategory } from "../repository/entities/ThreadCategory";
import { QuerySingleResult, QueryArrayResult } from '../repository/QueryResult';
import { UserResult } from "../repository/UserRepo";

export type Repositories = {
  // ThreadRepo exports
  createThread: (
    userId: string,
    categoryId: string,
    title: string,
    body: string
  ) => Promise<{ messages?: string[] }>,
  getThreadById: (
    id: string
  ) => Promise<QuerySingleResult<Thread>>,
  getThreadsByCategoryId: (
    categoryId: string
  ) => Promise<QueryArrayResult<Thread>>,
  getThreadsLatest: () => Promise<QueryArrayResult<Thread>>,
  getThreadItemByThreadId: () => Promise<QueryArrayResult<ThreadItem>>,
  getAllCategories: () => Promise<QueryArrayResult<ThreadCategory>>,

  // UserRepo exports
  register: (
    email: string,
    userName: string,
    password: string
  ) => Promise<UserResult>,
  login: (
    userName: string,
    password: string
  ) => Promise<UserResult>,
  logout: (
    userName: string
  ) => Promise<string>,
};
