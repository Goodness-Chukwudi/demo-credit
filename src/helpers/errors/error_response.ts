const SESSION_EXPIRED = {
  code: 1,
  message: "Session expired. Please login again"
};

const INVALID_TOKEN = {
  code: 2,
  message: "Unable to authenticate request. Please login to continue"
};

const INVALID_SESSION_USER = {
  code: 3,
  message: "Unauthenticated user session. Please login again"
};

const EMAIL_REQUIRED = {
  code: 4,
  message: "Email is required"
};

const USER_NOT_FOUND = {
  code: 5,
  message: "User not found"
};

const PASSWORD_MISMATCH = {
  code: 6,
  message: "Passwords do not match"
};

const NEW_PASSWORD_REQUIRED = {
  code: 7,
  message: "New password required"
};

const INVALID_LOGIN = {
  code: 8,
  message: "Invalid email or password"
};

const DUPLICATE_EMAIL = {
  code: 9,
  message: "A user with this email already exist, please try a different email"
};

const BLACKLISTED_USER = {
  code: 9,
  message: "This user's record exist on Karma's blacklist"
};

const WALLET_NOT_FOUND = {
  code: 10,
  message: "This user's wallet was not found"
};

const SOURCE_WALLET_NOT_FOUND = {
  code: 11,
  message: "The source wallet for this transaction was not found"
};

const RECIPIENT_WALLET_NOT_FOUND = {
  code: 12,
  message: "The recipient wallet for this transaction was not found"
};

const INSUFFICIENT_BALANCE = {
  code: 13,
  message: "Insufficient balance"
};

const SETTLEMENT_ACCOUNT_NOT_FOUND = {
  code: 14,
  message: "No active settlement account details was found"
};

export {
  SESSION_EXPIRED,
  INVALID_TOKEN,
  INVALID_SESSION_USER,
  EMAIL_REQUIRED,
  USER_NOT_FOUND,
  PASSWORD_MISMATCH,
  NEW_PASSWORD_REQUIRED,
  INVALID_LOGIN,
  DUPLICATE_EMAIL,
  BLACKLISTED_USER,
  WALLET_NOT_FOUND,
  INSUFFICIENT_BALANCE,
  SETTLEMENT_ACCOUNT_NOT_FOUND,
  SOURCE_WALLET_NOT_FOUND,
  RECIPIENT_WALLET_NOT_FOUND
};
