export default function getKoreanPath(path: (string | number)[]) {
  return path.map((key) => {
    if (typeof key === "number") {
      return key;
    }
    switch (key) {
      case "email":
        return "이메일";
      case "code":
        return "인증 코드";
      case "token":
        return "토큰";
      case "name":
        return "이름";
      case "username":
        return "사용자 이름";
      case "password":
        return "비밀번호";
      case "bio":
        return "소개";
      case "profileImage":
        return "프로필 이미지";
      case "userToken":
        return "사용자 토큰";
      case "emailToken":
        return "이메일 토큰";
    }
    return key;
  });
}
