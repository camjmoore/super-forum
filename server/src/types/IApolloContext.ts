import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { DataSource } from 'typeorm';
import { Repositories } from './repository-types';
import { Loaders } from '../loaders';

export interface ApolloContext {
  req: Request & {
    session: {
      userId?: string | null;
    };
  };
  res: Response;
  dataSource: DataSource;
  redis: Redis;
  repository: Repositories;
  loaders: Loaders;
}
