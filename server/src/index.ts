import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import Redis from "ioredis";
import dataSource from "./data-source";
import { register, login, logout }  from "./repository/UserRepo";
import { createThread, getThreadsByCategoryId }  from "./repository/ThreadRepo";

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

declare module "express-session" {
  interface SessionData {
    userId?: string | null;
    loadedCount?: number;
  }
}

const main = async () => {

  dotenv.config();
  const app = express();
  const router = express.Router();

  dataSource.initialize()
    .then(() => {
      console.log("Data Source Inititialized!")
    })
    .catch((err: Error) => {
      console.log("There was an error initializing the data source", err)
    })

  const redisClient = new Redis({
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  })

  const redisStore  = new RedisStore({ client: redisClient })

  app.use(bodyParser.json());

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  )

  app.use(router);

  app.listen({ port: process.env.PORT }, () => {
    console.log(`Server ready on port ${process.env.PORT}`);
  });

  router.get("/", (req, res) => {
    if (!req.session?.userId) {
      req.session.userId = req.query.userid as string;
      console.log("userId is now set");
      req.session.loadedCount = 0;
    } else {
      req.session.loadedCount = (req.session.loadedCount || 0) + 1;
    }

    res.send(
      `userId: ${req.session!.userId}, loadedcount: ${req.session!.loadedCount}`
    );
  });

  router.post("/register", async (req, res, next) => {
    try {
      console.log("params", req.body);

      const userResult = await register(
        req.body.email,
        req.body.userName,
        req.body.password
      );

      if (userResult && userResult.user) {
        res.send(`new user created , userId: ${userResult.user.id}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const userResult = await login(req.body.userName, req.body.password);

      if (userResult && userResult.user) {
        req.session!.userId = userResult.user.id;
        res.send(`user logged in, userId: ${req.session?.userId}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }

    } catch (ex) {
      res.send(ex.message);
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      const msg = await logout(req.body.userName);

      if (msg) {
        req.session!.userId = null;
        res.send(msg);
      } else {
        next();
      }

    } catch (ex) {
      res.send(ex.message);
    }
  })

  router.post("/createthread", async (req, res) => {
    try {
      console.log("userId", req.session);
      console.log("body", req.body);
      const msg = await createThread(
        req.session!.userId as string,
        req.body.categoryId,
        req.body.title,
        req.body.body
      );
      res.send(msg);
    } catch (ex) {
      console.log(ex)
      res.send(ex.message)
    }
  })

  router.post("/categorythreads", async (req, res ) => {
    try {
      const threads = await getThreadsByCategoryId(req.body.categoryId);

      if (threads && threads.entities) {
        let titles = "";
        threads.entities.forEach((th) => {
          titles += th.title + ", ";
        })
        res.send(titles);
      }

      if (threads && threads.messages) {
        res.send(threads.messages[0]);
      }

    } catch (ex) {
      console.log(ex)
      res.send(ex.message);
    }
  });

}

main();
