import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './repository/entities/User.js';
import { Thread } from './repository/entities/Thread.js';
import { ThreadCategory } from './repository/entities/ThreadCategory.js';
import { ThreadItem } from './repository/entities/ThreadItem.js';
import { ThreadPoint } from './repository/entities/ThreadPoint.js';
import { ThreadItemPoint } from './repository/entities/ThreadItemPoint.js';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  username: process.env.PG_ACCOUNT,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: process.env.PG_SYNCHRONIZE == 'true',
  logging: process.env.PG_LOGGING == 'true',
  entities: [User, Thread, ThreadCategory, ThreadItem, ThreadPoint, ThreadItemPoint],
  migrations: [],
} as DataSourceOptions);

export default dataSource;
