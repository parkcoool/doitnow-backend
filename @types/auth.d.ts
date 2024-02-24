declare module "auth" {
  /**
   * @description `kakao`, `naver` 등의 인증 제공자입니다. `null`은 로컬 인증을 의미합니다.
   */
  type AuthProvider = null | "kakao";
}
