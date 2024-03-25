import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.listen(80, () => {
  console.log("Server is running on port 80");
});
