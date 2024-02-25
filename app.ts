import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "./routes/api";

dotenv.config();

const app = express();
const port = 80;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
