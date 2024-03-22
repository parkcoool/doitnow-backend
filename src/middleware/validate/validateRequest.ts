import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import getKoreanPath from "util/getKoreanPath";
import hasJongseong from "util/hasJongseong";

// https://zod.dev/ERROR_HANDLING?id=zodissuecode
z.setErrorMap((error, ctx) => {
  const pathString = getKoreanPath(error.path).join(", ");
  const pathStringAsSubject = `${pathString}${hasJongseong(pathString) ? "이" : "가"}`;
  const pathStringWithBojosa = `${pathString}${hasJongseong(pathString) ? "은" : "는"}`;

  switch (error.code) {
    case z.ZodIssueCode.invalid_type: {
      if (error.received === "undefined") return { message: `${pathStringAsSubject} 전송되지 않았어요.` };
      return { message: `${pathStringAsSubject} 올바른 형식이 아니에요.` };
    }

    case z.ZodIssueCode.invalid_date: {
      return { message: `${pathStringAsSubject} 올바른 날짜 형식이 아니에요.` };
    }

    case z.ZodIssueCode.invalid_string: {
      if (error.validation === "email") return { message: `${pathStringAsSubject} 올바른 이메일 형식이 아니에요.` };
      if (error.validation === "url") return { message: `${pathStringAsSubject} 올바른 URL 형식이 아니에요.` };
      return { message: `${pathStringAsSubject} 올바른 문자열 형식이 아니에요.` };
    }

    case z.ZodIssueCode.too_small: {
      if (error.type === "string")
        return { message: `${pathStringWithBojosa} ${error.exact ? "" : "최소 "}${error.minimum}자여야 해요.` };
      return { message: `${pathStringWithBojosa} ${error.exact ? "" : "최소 "}${error.minimum}이어야 해요.` };
    }

    case z.ZodIssueCode.too_big: {
      if (error.type === "string")
        return { message: `${pathStringWithBojosa} ${error.exact ? "" : "최대 "}${error.maximum}자여야 해요.` };
      return { message: `${pathStringWithBojosa} ${error.exact ? "" : "최대 "}${error.maximum}이어야 해요.` };
    }

    case z.ZodIssueCode.unrecognized_keys: {
      return { message: `${pathStringWithBojosa} 알 수 없는 값이에요.` };
    }
  }

  return { message: ctx.defaultError };
});

interface ValidateRequestProps {
  body?: z.Schema;
  query?: z.Schema;
  params?: z.Schema;
}

export default function validateRequest({ body, query, params }: ValidateRequestProps) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      body?.parse(req.body);
      query?.parse(req.query);
      params?.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}
