import {
  createThread,
  getThreadById,
  getThreadsByCategoryId,
  getThreadsLatest,
  getThreadItemByThreadId,
  getAllCategories,
  getUserThreads,
  getTopCategoryThreads,
} from './ThreadRepo';
import {
  register,
  login,
  logout,
  getUserById,
  changePassword,
} from './UserRepo';
import {
  createThreadItem,
  getThreadItemById,
  getThreadItemsByThreadId,
  getUserThreadItems,
} from './ThreadItemRepo';
import {
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from './CategoryRepo';
import { updateThreadPoint, updateThreadItemPoint } from './PointsRepo';
import type { Repositories } from '../types/repository-types';

export const repository: Repositories = {
  // Thread operations
  createThread,
  getThreadById,
  getThreadsByCategoryId,
  getThreadsLatest,
  getUserThreads,
  getTopCategoryThreads,

  // ThreadItem operations
  createThreadItem,
  getThreadItemById,
  getThreadItemByThreadId,
  getThreadItemsByThreadId,
  getUserThreadItems,

  // Category operations
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,

  // User operations
  register,
  login,
  logout,
  getUserById,
  changePassword,

  // Points operations
  updateThreadPoint,
  updateThreadItemPoint,
};
