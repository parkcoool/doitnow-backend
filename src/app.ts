import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";

import apiRouter from "routes/api";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? 8080 : 8081;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// webhook 등록
if (!isProduction) {
  const webhook = express();

  webhook.use(express.json());

  webhook.post("/webhook", (req, res) => {
    const githubEvent = req.headers["x-github-event"];

    if (githubEvent === "push") {
      console.log("push event");
      exec("git pull", (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }

        console.log(stdout);
        return res.status(200).send("ok");
      });
    }
  });

  webhook.listen(8082, () => {
    console.log("Webhook is running on port 8082");
  });
}
