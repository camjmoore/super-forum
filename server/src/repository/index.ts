import { createThread, getThreadById, getThreadsByCategoryId, getThreadsLatest, getThreadItemByThreadId, getAllCategories } from './ThreadRepo';
import { register, login, logout } from './UserRepo';
import type { Repositories } from '../types/repository-types';

export const repository: Repositories = {
  createThread,
  getThreadById,
  getThreadsByCategoryId,
  getThreadsLatest,
  getThreadItemByThreadId,
  getAllCategories,
  register,
  login,
  logout,
};