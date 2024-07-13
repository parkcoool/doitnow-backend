import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const offset = z.number().nonnegative().max(4294967295);

const orderBy = z.enum(["createdAt", "due"]);

const taskSchema = {
  id,
  offset,
  orderBy,
};

export default taskSchema;
