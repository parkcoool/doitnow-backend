import { z } from "zod";

const id = z.number().nonnegative().max(4294967295);

const email = z.string().email().max(50);

const name = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "이름은 영어, 숫자, 밑줄(_)만 쓸 수 있어요.",
  });

const username = z
  .string()
  .min(2)
  .max(20)
  .regex(/^[가-힣a-zA-Z]+$/, {
    message: "사용자 이름은 한글과 영어만 사용할 수 있어요.",
  });

const password = z
  .string()
  .min(8)
  .max(20)
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/, {
    message: "비밀번호는 영어, 숫자를 조합하여야 해요.",
  });

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
