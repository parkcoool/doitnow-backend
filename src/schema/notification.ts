import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const offset = z.number().nonnegative();

const notificationSchema = {
  id,
  offset,
};

export default notificationSchema;
