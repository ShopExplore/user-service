import cors from "cors";
import express, { Application, NextFunction, Response, Request } from "express";
import helmet from "helmet";
import appConfig from ".";

import { connectMongoDb } from "./persistence/database";
import { handleResponse } from "../utils/response";
import v1Routers from "../components/v1/v1Routes";
import SEEDING from "./persistence/seed";

const app: Application = express();

const initializePersistenceAndSeeding = async () => {
  connectMongoDb().catch((err: any) => console.log(err, "error"));
  await SEEDING();
};

const initializeMiddlewares = () => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    `http://localhost:${appConfig.port}`,
    `http://127.0.0.1:${appConfig.port}`,
  ];

  const corsOptions = {
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app
    // .use(
    //   rateLimiterMiddleware({
    //     window: 60 * 1000,
    //     maxRequests: 50,
    //     perSecond: 10,
    //   })
    // )
    .use(cors(corsOptions))
    .use(express.json({ limit: "50kb" }))
    .use(express.urlencoded({ limit: "50kb", extended: false }))
    .use(helmet())
    .use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (req.method === "OPTIONS") {
        res.header(
          "Access-Control-Allow-Methods",
          "POST, PUT, PATCH, GET, DELETE"
        );
        return handleResponse({
          res,
          status: 403,
          message: "Invalid header method",
        });
      }

      if (req.body && err instanceof SyntaxError) {
        return res.status(400).json({
          message: "Malformed JSON, check the body of the request",
        });
      }

      return next();
    });
};

const initializeRoutes = () => {
  app.use("/v2", v1Routers);

  app.get("/", (_req, res) => {
    res.json({ message: "Up and running in " + appConfig.environment });
  });

  app.all("*", (_req, res: Response) =>
    handleResponse({
      res,
      status: 404,
      message: "You have used an invalid method or hit an invalid route",
    })
  );
};

initializePersistenceAndSeeding();
initializeMiddlewares();
initializeRoutes();

export default app;
