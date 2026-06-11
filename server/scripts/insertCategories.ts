import { ThreadCategory } from "../src/repository/entities/ThreadCategory.js";
import datasource from "../src/data-source.js";

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
