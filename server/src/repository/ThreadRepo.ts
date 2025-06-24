import { User } from "./entities/User";
import { Thread } from "./entities/Thread";
import { ThreadCategory } from "./entities/ThreadCategory";
import { QuerySingleResult, QueryArrayResult } from "./QueryResult";
import { isThreadTitleValid, isThreadBodyValid } from "./validators/ThreadValidator";
import { ThreadItem } from "./entities/ThreadItem";

export const createThread = async (
  userId: string,
  categoryId: string,
  title: string,
  body: string
): Promise<QuerySingleResult<Thread>> => {

  const titleMsg = isThreadTitleValid(title);
  if (titleMsg) {
    return {
      messages: [titleMsg],
    };
  }

  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg) {
    return {
      messages: [bodyMsg],
    };
  }

  //users must be logged in to post
  const user = await User.findOne({
    where: { id: userId }
  });
  if (!user) {
    return {
      messages: ["User not logged in."],
    };
  }

  const category = await ThreadCategory.findOne({
    where: {id: categoryId}
  });
  if (!category) {
    return {
      messages: ["category not found."],
    };
  }

  const thread = await Thread.create({
    title,
    body,
    user,
    threadCategory: category,
  }).save();
  if (!thread) {
    return {
      messages: ["Failed to create thread."]
    };
  }

  return {
    messages: ["Thread created successfully."],
  };
};

export const getThreadById = async (
  id: string
): Promise<QuerySingleResult<Thread>> => {

  const thread = await Thread.findOne({ where: { id }});

  if (!thread) {
    return {
      messages: ["Thread not found."],
    };
  }

  return {
    entity: thread
  };
};

export const getThreadsByCategoryId = async (
  categoryId: string
): Promise<QueryArrayResult<Thread>> => {

  const threads = await Thread
    .createQueryBuilder("thread")
    .where("thread.threadCategory = :categoryId", { categoryId })
    .leftJoinAndSelect("thread.threadCategory", "threadCategory")
    .orderBy("thread.createdOn", "DESC")
    .getMany();

  if (!threads) {
    return {
      messages: ["threads of category not found."]
    };
  }

  console.log(threads);
  return {
    entities: threads
  }
}

export const getThreadsLatest = async (): Promise<QueryArrayResult<Thread>> => {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - 24);
  //get threads within last 24 hours

  const threads = await Thread
    .createQueryBuilder("thread")
    .leftJoinAndSelect("thread.threadCategory", "threadCategory")
    .where("thread.createdOn >= :startDate", { startDate })
    .orderBy("thread.createdOn", "DESC")
    .getMany();

    if (!threads || threads.length === 0) {
    return {
      messages: ["No Recent threads"]
    };
  }

  return {
    entities: threads
  };
}
//thread item functions should be slpit into a new repo file: ThreadItemRepo

export const getThreadItemByThreadId = async (
  id: string
): Promise<QueryArrayResult<ThreadItem>> => {
  const threadItems = await ThreadItem
    .createQueryBuilder("threadItem")
    .leftJoinAndSelect("threadItem.user", "user")
    .leftJoinAndSelect("threadItem.thread", "thread")
    .where("thread.id = :threadId", { threadId: id })
    .orderBy("threadItem.createdOn", "ASC")
    .getMany();

  if(!threadItems || threadItems.length === 0) {
    return {
      messages: [`Thread with id ${id} not found.`]
    }
  }

  return {
    entities: threadItems
  };
}

export const getAllCategories = async (): Promise<QueryArrayResult<ThreadCategory>> => {
  const threadCategories = await ThreadCategory.find({
    order: { name: "ASC" }
  });

  return {
    entities: threadCategories
  }
}
