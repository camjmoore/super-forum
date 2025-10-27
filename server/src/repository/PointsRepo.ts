import { User } from './entities/User';
import { Thread } from './entities/Thread';
import { ThreadItem } from './entities/ThreadItem';
import { ThreadPoint } from './entities/ThreadPoint';
import { ThreadItemPoint } from './entities/ThreadItemPoint';

export const updateThreadPoint = async (
  userId: string,
  threadId: string,
  increment: boolean
): Promise<string[]> => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return ['User not found.'];
  }

  const thread = await Thread.findOne({ where: { id: threadId } });
  if (!thread) {
    return ['Thread not found.'];
  }

  // Check if user has already voted on this thread
  const existingPoint = await ThreadPoint.findOne({
    where: { user: { id: userId }, thread: { id: threadId } },
    relations: ['user', 'thread'],
  });

  if (existingPoint) {
    // User has already voted, update the vote
    const wasIncrement = !existingPoint.isDecrement;

    if (wasIncrement === increment) {
      // Same vote type, remove the vote
      await existingPoint.remove();

      // Update thread points
      const pointChange = increment ? -1 : 1;
      thread.points = (thread.points || 0) + pointChange;
      await thread.save();

      return ['Vote removed successfully.'];
    } else {
      // Different vote type, update the existing vote
      existingPoint.isDecrement = !increment;
      await existingPoint.save();

      // Update thread points (swing by 2: remove old vote and add new vote)
      const pointChange = increment ? 2 : -2;
      thread.points = (thread.points || 0) + pointChange;
      await thread.save();

      return ['Vote updated successfully.'];
    }
  } else {
    // User hasn't voted yet, create new vote
    await ThreadPoint.create({
      isDecrement: !increment,
      user,
      thread,
    }).save();

    // Update thread points
    const pointChange = increment ? 1 : -1;
    thread.points = (thread.points || 0) + pointChange;
    await thread.save();

    return ['Vote added successfully.'];
  }
};

export const updateThreadItemPoint = async (
  userId: string,
  threadItemId: string,
  increment: boolean
): Promise<string[]> => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return ['User not found.'];
  }

  const threadItem = await ThreadItem.findOne({ where: { id: threadItemId } });
  if (!threadItem) {
    return ['Thread item not found.'];
  }

  // Check if user has already voted on this thread item
  const existingPoint = await ThreadItemPoint.findOne({
    where: { user: { id: userId }, threadItem: { id: threadItemId } },
    relations: ['user', 'threadItem'],
  });

  if (existingPoint) {
    // User has already voted, update the vote
    const wasIncrement = !existingPoint.isDecrement;

    if (wasIncrement === increment) {
      // Same vote type, remove the vote
      await existingPoint.remove();

      // Update thread item points
      const pointChange = increment ? -1 : 1;
      threadItem.points = (threadItem.points || 0) + pointChange;
      await threadItem.save();

      return ['Vote removed successfully.'];
    } else {
      // Different vote type, update the existing vote
      existingPoint.isDecrement = !increment;
      await existingPoint.save();

      // Update thread item points (swing by 2)
      const pointChange = increment ? 2 : -2;
      threadItem.points = (threadItem.points || 0) + pointChange;
      await threadItem.save();

      return ['Vote updated successfully.'];
    }
  } else {
    // User hasn't voted yet, create new vote
    await ThreadItemPoint.create({
      isDecrement: !increment,
      user,
      threadItem,
    }).save();

    // Update thread item points
    const pointChange = increment ? 1 : -1;
    threadItem.points = (threadItem.points || 0) + pointChange;
    await threadItem.save();

    return ['Vote added successfully.'];
  }
};
