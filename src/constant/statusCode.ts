enum StatusCode {
  // 1000-1999: Common
  SUCCESS = 1000,
  NOT_FOUND = 1001,
  SERVER_ERROR = 1002,

  // 2000-2999: User
  INVALID_EMAIL = 2000,
  DUPLICATED_VALUES = 2001,
  INVALID_NAME = 2002,
}

export default StatusCode;
