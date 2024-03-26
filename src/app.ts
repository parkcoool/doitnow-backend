import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";
import webhookRouter from "routes/webhook";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? 8080 : 8081;

const app = express();

const corsOptions: cors.CorsOptions = isProduction
  ? {
      origin: "https://doitnow.kr",
    }
  : {};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// webhook 등록
if (!isProduction) {
  const webhook = express();

  webhook.use(express.json());
  webhook.use(cors());

  webhook.use("/webhook", webhookRouter);

  webhook.listen(8082, () => {
    console.log("Webhook is running on port 8082");
  });
}
