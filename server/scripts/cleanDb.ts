import datasource from "../src/data-source.js"

export const cleanDB = async () => {
  await datasource.initialize();
  await datasource.dropDatabase();
}

cleanDB();
