import express from "express";

import type { AuthProvider } from "auth";

interface GetTokenBody {
  authProvider: AuthProvider;
  code?: string;
  identifier?: string;
  password?: string;
}

const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello, world!",
  });
});

export default router;
