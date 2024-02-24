declare module "api" {
  /**
   * @description doitnow API 서버의 응답 형식입니다.
   * @template T 응답의 `result` 필드에 포함된 데이터의 타입입니다.
   */
  interface APIResponse<T> {
    code: number;
    message: string;
    result: T;
  }
}
