import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRouter from "routes/api";
// import webhookRouter from "routes/webhook";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

// api 등록
{
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
}

// webhook 등록
// if (!isProduction) {
//   const port = 8082;
//   const webhook = express();
// 
//   webhook.use(express.json());
//   webhook.use(cors());
// 
//   webhook.use("/webhook", webhookRouter);
// 
//   webhook.listen(port, () => {
//     console.log(`Webhook is running on port ${port}`);
//   });
// }
// 