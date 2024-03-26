import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { exec } from "child_process";

const githubRouter = express.Router();

dotenv.config();

githubRouter.post("/", (req, res) => {
  const auth = req.headers["x-hub-signature-256"] as string | undefined;

  if (auth === undefined) return res.status(401).send("Unauthorized");

  const signature = crypto.createHmac("sha256", process.env.APP_SECRET!).update(JSON.stringify(req.body)).digest("hex");
  const trusted = Buffer.from(`sha256=${signature}`, "ascii");
  const untrusted = Buffer.from(auth, "ascii");
  const verified = crypto.timingSafeEqual(trusted, untrusted);

  if (!verified) {
    return res.status(401).send("Unauthorized");
  }

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
  } else {
    return res.status(200).send("ok");
  }
});

export default githubRouter;
