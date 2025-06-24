import { Request, Response } from "express";
import { Redis } from "ioredis";
import { DataSource } from "typeorm";

export interface ApolloContext {
  req: Request & {
    session: {
      userId?: string | null;
    }
  };
  res: Response;
  dataSource: DataSource;
  redis: Redis;
}
