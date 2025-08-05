import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import path from 'path';

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "http://localhost:4201"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use(express.json());
app.use(cookieParser());

routes(app);

export default app;
