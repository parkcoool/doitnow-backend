import { z } from "zod";

const email = z.string().email().max(50);
const code = z.string().length(4);

const emailVerifyCodeSchema = {
  email,
  code,
};

export default emailVerifyCodeSchema;
