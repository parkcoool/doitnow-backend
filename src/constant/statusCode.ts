enum StatusCode {
  // 1000-1999: Common
  SUCCESS = 1000,
  NOT_FOUND = 1001,
  SERVER_ERROR = 1002,
  BAD_REQUEST = 1003,

  // 2000-2999: User
  INVALID_EMAIL = 2000,
  DUPLICATED_VALUES = 2001,
  INVALID_NAME = 2002,
  INVALID_PASSWORD = 2003,

  // 3000-3999: Auth
  VERIFY_CODE_NOT_MATCHED = 3000,
  INVALID_EMAIL_TOKEN = 3001,
  INVALID_REFRESH_TOKEN = 3002,
}

export default StatusCode;
