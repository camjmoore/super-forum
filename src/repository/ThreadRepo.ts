import { User } from "./entities/User";
import { Thread } from "./entities/Thread";
import { ThreadCategory } from "./entities/ThreadCategory";
import { QuerySingleResult, QueryArrayResult } from "./QueryResult";
import { isThreadTitleValid, isThreadBodyValid } from "./validators/ThreadValidator";

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

  const thread = Thread.findOne({ where: { id }});
  if (!thread) {
    return {
      messages: ["Thread not found."],
    };
  }

  return {
    entity: thread,
  };
};
