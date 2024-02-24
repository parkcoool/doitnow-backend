import express from "express";

import apiRouter from "./routes/api";

const app = express();
const port = 80;

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
