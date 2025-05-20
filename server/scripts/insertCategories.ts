import { ThreadCategory } from "../src/repository/entities/ThreadCategory.ts";
import datasource from "../src/data-source.ts";

const insertCategories = async () => {
  await datasource.initialize();
  await datasource
    .createQueryBuilder()
    .insert()
    .into(ThreadCategory)
    .values([
      { name: "Programming", description: "" },
      { name: "Cooking", description: "" },
      { name: "Gaming", description: "" },
      { name: "Finance", description: "" },
      { name: "Travel", description: "" },
    ])
    .execute()
}

insertCategories();
