import express, { type Request, type Response } from "express";
import morgan from "morgan";
import { ENV } from "./config/env";
import router from "./routes/index";
import { syncDatabase, testConnection } from "./config/database";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(express.static("public"));

app.use(morgan("dev"));
app.use(express.json());

testConnection();

app.use(`/api/${ENV.API_VERSION}`, router);
app.use(errorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from the server.");
});

function main() {
  syncDatabase();
  app.listen(ENV.PORT, () => {
    console.log("Server is running on port 5000");
  });
}

main();
