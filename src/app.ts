import express, { Express } from "express";
import dotenv from "dotenv";
import pinoHttp from "pino-http";
import userRoutes from "./routes/user.routes";
import connectDB from "./databases";
import logger from "./services/logger";
import { swaggerUi, specs } from "./swagger";
import { rateLimiter } from "./middlewares/rateLimiter.middlewares";

dotenv.config();

const app: Express = express();
const pinoHttpOptions = {
  logger: logger,
  autoLogging: true,
};
const httpLogger = pinoHttp(pinoHttpOptions);
// Connect to MongoDB
connectDB();

// Middleware
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:4000"];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin as string) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin as string);
  }
  // Website you wish to allow to connect

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Pass to next layer of middleware
  next();
});
app.use(express.json());

app.use(rateLimiter);

if (process.env.NODE_ENV === "production") {
  app.use(httpLogger);
}
// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get("/", (req, res) => {
  res.send(`Version ${process.env.npm_package_version}`);
});
app.use("/api/users", userRoutes);

export { app };
