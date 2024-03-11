import sendEmailRouter from "./";

import StatusCode from "constant/statusCode";
import addEmailVerifyCode from "model/emailVerify/addEmailVerifyCode";

import type { APIResponse } from "api";

interface ReqeustBody {
  email: string;
}

interface ResponseBody {
  email: string;
  expiresAt: string;
}

sendEmailRouter.post<"/", {}, APIResponse<ResponseBody | null>, ReqeustBody>("/", async (req, res, next) => {
  if (/\S+@\S+\.\S+/.test(req.body.email) === false) {
    return res.status(200).send({
      code: StatusCode.INVALID_EMAIL,
      message: "이메일 주소가 올바르지 않습니다.",
      result: null,
    });
  }

  // 인증 코드 생성
  const code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  console.log(code);

  // 이메일 주소 정제
  const email = req.body.email.trim();

  // 인증 코드 만료 시간 설정
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  // 클라이언트 IP 주소 추출
  const ipAddr = req.ip;

  // 인증 코드를 데이터베이스에 저장
  try {
    const queryResult = await addEmailVerifyCode(code, email, expiresAt, ipAddr);
    if (queryResult.affectedRows === 0) throw new Error();
  } catch (e) {
    res.status(200).send({
      code: StatusCode.SERVER_ERROR,
      message: "인증 코드를 등록하는 도중 오류가 발생했습니다.",
      result: null,
    });
    return;
  }

  // 인증 코드를 이메일로 발송
  try {
    // ...
  } catch (e) {
    res.status(200).send({
      code: StatusCode.SERVER_ERROR,
      message: "인증 코드를 발송하는 도중 오류가 발생했습니다.",
      result: null,
    });
    return;
  }

  res.status(200).send({
    code: StatusCode.SUCCESS,
    message: "인증 코드를 성공적으로 발송하였습니다.",
    result: {
      email: email,
      expiresAt: expiresAt.toISOString(),
    },
  });
});
