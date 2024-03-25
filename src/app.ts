import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", apiRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
