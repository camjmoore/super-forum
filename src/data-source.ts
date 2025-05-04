import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  username: process.env.PG_ACCOUNT,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: process.env.PG_SYNCHRONIZE == "true",
  logging: process.env.PG_LOGGING == "true",
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
})

export default dataSource
