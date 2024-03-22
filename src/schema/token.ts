import { z } from "zod";

const token = z.string().regex(/^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/);

const tokenSchema = {
  token,
};

export default tokenSchema;
