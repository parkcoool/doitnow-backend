import express from "express";

import authRouter from "./routes/auth";

const app = express();
const port = 80;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
