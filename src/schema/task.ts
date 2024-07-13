import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const title = z.string().min(1).max(255);

const offset = z.number().nonnegative().max(4294967295);

const done = z
  .string()
  .refine((value) => value === "true" || value === "false", {
    message: "'true' 또는 'false'여야 합니다.",
  });

const date = z.string().refine(
  (value) => {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
  },
  { path: ["offsetDate"], message: "올바른 날짜 형식이 아닙니다." }
);

const orderBy = z.enum(["createdAt", "due"]);

const taskSchema = {
  id,
  title,
  offset,
  done,
  date,
  orderBy,
};

export default taskSchema;
