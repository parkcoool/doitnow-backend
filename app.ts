import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import https from "https";
// import fs from "fs";

import apiRouter from "./src/routes/api";

dotenv.config();

const options = {
  // key: fs.readFileSync("./src/config/key.pem"),
  // cert: fs.readFileSync("./src/config/cert.pem"),
};

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

https.createServer(options, app).listen(443, () => {
  console.log("App is listening on port 443");
});
