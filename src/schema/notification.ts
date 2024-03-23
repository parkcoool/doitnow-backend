import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const offsetDate = z.string().refine(
  (value) => {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d.getTime());
  },
  { path: ["offsetDate"], message: "올바른 날짜 형식이 아닙니다." }
);

const notificationSchema = {
  id,
  offsetDate,
};

export default notificationSchema;
