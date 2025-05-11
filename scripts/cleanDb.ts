import datasource from "../src/data-source.ts"

export const cleanDB = async () => {
  await datasource.initialize();
  await datasource.dropDatabase();
}

cleanDB();

