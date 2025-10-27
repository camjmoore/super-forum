import { User } from './entities/User';
import { Thread } from './entities/Thread';
import { ThreadItem } from './entities/ThreadItem';
import { QuerySingleResult, QueryArrayResult } from './QueryResult';
import { isThreadBodyValid } from './validators/ThreadValidator';

export const createThreadItem = async (
  userId: string,
  threadId: string,
  body: string
): Promise<QuerySingleResult<ThreadItem>> => {
  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg) {
    return {
      messages: [bodyMsg],
    };
  }

  // Users must be logged in to post
  const user = await User.findOne({
    where: { id: userId },
  });
  if (!user) {
    return {
      messages: ['User not logged in.'],
    };
  }

  const thread = await Thread.findOne({
    where: { id: threadId },
  });
  if (!thread) {
    return {
      messages: ['Thread not found.'],
    };
  }

  const threadItem = await ThreadItem.create({
    body,
    user,
    thread,
  }).save();

  if (!threadItem) {
    return {
      messages: ['Failed to create thread item.'],
    };
  }

  return {
    messages: ['Thread item created successfully.'],
    entity: threadItem,
  };
};

export const getThreadItemById = async (
  id: string
): Promise<QuerySingleResult<ThreadItem>> => {
  const threadItem = await ThreadItem.findOne({
    where: { id },
    relations: ['user', 'thread'],
  });

  if (!threadItem) {
    return {
      messages: ['Thread item not found.'],
    };
  }

  return {
    entity: threadItem,
  };
};

export const getThreadItemsByThreadId = async (
  threadId: string
): Promise<QueryArrayResult<ThreadItem>> => {
  const threadItems = await ThreadItem.createQueryBuilder('threadItem')
    .leftJoinAndSelect('threadItem.user', 'user')
    .leftJoinAndSelect('threadItem.thread', 'thread')
    .where('thread.id = :threadId', { threadId })
    .orderBy('threadItem.createdOn', 'ASC')
    .getMany();

  if (!threadItems || threadItems.length === 0) {
    return {
      messages: [`No thread items found for thread ${threadId}.`],
    };
  }

  return {
    entities: threadItems,
  };
};

export const getUserThreadItems = async (
  userId: string
): Promise<QueryArrayResult<ThreadItem>> => {
  const threadItems = await ThreadItem.createQueryBuilder('threadItem')
    .leftJoinAndSelect('threadItem.user', 'user')
    .leftJoinAndSelect('threadItem.thread', 'thread')
    .where('user.id = :userId', { userId })
    .orderBy('threadItem.createdOn', 'DESC')
    .getMany();

  return {
    entities: threadItems || [],
  };
};
