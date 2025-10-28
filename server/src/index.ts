import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import dataSource from './data-source';
import { repository } from './repository';
import { createApolloServer } from './apollo';
import { expressMiddleware } from '@as-integrations/express5';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      COOKIE_NAME: string;
      SESSION_SECRET: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: string | null;
    loadedCount?: number;
  }
}

const main = async () => {
  // Initialize environment variables
  dotenv.config();

  // Initialize Express app
  const app = express();
  const router = express.Router();

  // Initialize TypeORM Data Source
  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source Inititialized!');
    })
    .catch((err: Error) => {
      console.log('There was an error initializing the data source', err);
    });

  // Initialize Redis Client
  const redisClient = new Redis({
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });

  // Initialize Redis Store
  const redisStore = new RedisStore({ client: redisClient });

  // Setup parser middleware
  app.use(bodyParser.json());

  // Setup session middleware
  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );

  // Setup router middleware
  app.use(router);

  // Initialize Apollo Server
  const apolloServer = await createApolloServer();
  await apolloServer.start();

  //Setup Apollo middleware
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        req,
        res,
        dataSource,
        redis: redisClient,
        repository,
      }),
    })
  );

  app.listen({ port: process.env.PORT }, () => {
    console.log(`Server ready on port ${process.env.PORT}`);
  });

  router.get('/', (req, res) => {
    if (!req.session?.userId) {
      req.session.userId = req.query.userId as string;
      console.log('userId is now set');
      req.session.loadedCount = 0;
    } else {
      req.session.loadedCount = (req.session.loadedCount || 0) + 1;
    }

    res.send(
      `userId: ${req.session!.userId}, loadedcount: ${req.session!.loadedCount}`
    );
  });
};

main();
