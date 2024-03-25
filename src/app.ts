import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";

dotenv.config();
const port = process.env.NODE_ENV === "production" ? 8080 : 8081;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
