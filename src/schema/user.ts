import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);
const email = z.string().email().max(50);
const name = z.string().regex(/^[a-zA-Z0-9_]{3,20}$/);
const username = z.string().regex(/^[가-힣a-zA-Z]{2,20}$/);
const password = z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/);
const bio = z.string().max(100).or(z.null());
const profileImage = z.string().max(512).url().or(z.null());

const userSchema = {
  id,
  email,
  name,
  username,
  password,
  bio,
  profileImage,
};

export default userSchema;
