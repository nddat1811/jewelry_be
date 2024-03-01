import "reflect-metadata";
import express, { Express } from "express";
import morgan from "morgan";
import Router from "./routes";
import swaggerDocs from "./utils/swagger";
import { DatabaseSingleton} from "./config/database";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = 8000;

const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: [
    "https://www.yoursite.com",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://localhost:9200",
    "http://localhost:3000"
  ], // Replace with the origin(s) of your client application
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // Respond with a 204 for preflight requests
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(Router);

app.listen(PORT, async () => {
  console.log(`App is running at http://localhost:${PORT}`);

  // await connectToDatabase();
  const connection = await DatabaseSingleton.getInstance();
  swaggerDocs(app, PORT);

  // await DatabaseSingleton.closeConnection();
});
