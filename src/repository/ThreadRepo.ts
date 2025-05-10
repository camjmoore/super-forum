import { User } from "./entities/User";
import { Thread } from "./entities/Thread";
import { ThreadCategory } from "./entities/ThreadCategory";
import { QueryResult } from "./QueryResult";
import { isThreadTitleValid, isThreadBodyValid } from "./validators/ThreadValidator";

export const createThread = async (
  userId: string,
  categoryId: string,
  title: string,
  body: string
): Promise<QueryResult<Thread>> => {
  const titleMsg = isThreadTitleValid(title);

  if (titleMsg) {
    return {
      message: [titleMsg],
    };
  }

  const bodyMsg = isThreadBodyValid(body);

  if (bodyMsg) {
    return {
      message: [bodyMsg],
    };
  }

  //users must be logged in to post
  const user = await User.findOne({
    where: { id: userId }
  });

  if (!user) {
    return {
      message: ["User not logged in."],
    };
  }

  const category = await ThreadCategory.findOne({
    where: {id: categoryId}
  });

  if (!category) {
    return {
      message: ["category not found."],
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
      message: ["Failed to create thread."]
    };
  }

  return {
    message: ["Thread created successfully."],
  };
};
