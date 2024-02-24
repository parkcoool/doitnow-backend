import express from "express";

const app = express();
const port = 80;

app.listen(port, function () {
  console.log(`App is listening on port ${port}`);
});
