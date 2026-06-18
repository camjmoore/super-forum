import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { User } from './repository/entities/User';
import { ThreadCategory } from './repository/entities/ThreadCategory';
import { ThreadItem } from './repository/entities/ThreadItem';

export function createLoaders() {
  const userLoader = new DataLoader<string, User | null>(async (ids) => {
    const users = await User.find({ where: { id: In([...ids]) } });
    const map = new Map(users.map((u) => [u.id, u]));
    return ids.map((id) => map.get(id) ?? null);
  });

  const categoryLoader = new DataLoader<string, ThreadCategory | null>(
    async (ids) => {
      const cats = await ThreadCategory.find({ where: { id: In([...ids]) } });
      const map = new Map(cats.map((c) => [c.id, c]));
      return ids.map((id) => map.get(id) ?? null);
    }
  );

  // Batch-fetches all ThreadItems for a set of thread IDs in one query.
  const threadItemsLoader = new DataLoader<string, ThreadItem[]>(
    async (threadIds) => {
      const items = await ThreadItem.find({
        where: { thread: { id: In([...threadIds]) } },
        relations: ['thread', 'user'],
      });
      const map = new Map<string, ThreadItem[]>();
      for (const item of items) {
        const tid = item.thread?.id;
        if (!tid) continue;
        const list = map.get(tid) ?? [];
        list.push(item);
        map.set(tid, list);
      }
      return threadIds.map((id) => map.get(id) ?? []);
    }
  );

  return { userLoader, categoryLoader, threadItemsLoader };
}

export type Loaders = ReturnType<typeof createLoaders>;
