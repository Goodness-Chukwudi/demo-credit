enum BIT {
  ON = 1,
  OFF = 0
}

enum USER_STATUS {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
  DELETED = "deleted",
  PENDING = "pending"
}

enum PASSWORD_STATUS {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
  DELETED = "deleted"
}

enum GENDER {
  MALE = "male",
  FEMALE = "female"
}

enum ACCOUNT_STATUS {
  ACTIVE = "active",
  IN_ACTIVE = "in-active",
  BLACKLISTED = "blacklisted"
}

enum TRANSACTION_TYPE {
  TRANSFER = "wallet-transfer",
  WITHDRAWAL = "withdrawal",
  DEPOSIT = "deposit",
  REVERSAL = "reversal",
  PAYMENT = "payment"
}

enum TRANSACTION_CHANNEL {
  WALLET = "wallet",
  BANK = "bank",
  CARD = "card",
  USSD = "ussd"
}

enum TRANSACTION_STATUS {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed"
}

enum WALLET_TYPE {
  INDIVIDUAL = "individual",
  MERCHANT = "merchant",
  ADMIN = "admin",
  DISPOSABLE = "disposable"
}

enum WALLET_TIER {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

enum WALLET_STATUS {
  ACTIVE = "active",
  FROZEN = "frozen",
  CLOSED = "closed"
}

enum CURRENCY {
  USD = "USD", // US Dollar
  EUR = "EUR", // Euro
  GBP = "GBP", // British Pound Sterling
  JPY = "JPY", // Japanese Yen
  AUD = "AUD", // Australian Dollar
  CAD = "CAD", // Canadian Dollar
  CHF = "CHF", // Swiss Franc
  CNY = "CNY", // Chinese Yuan
  HKD = "HKD", // Hong Kong Dollar
  SGD = "SGD", // Singapore Dollar
  INR = "INR", // Indian Rupee
  NGN = "NGN", // Nigerian Naira
  ZAR = "ZAR", // South African Rand
  BRL = "BRL", // Brazilian Real
  MXN = "MXN", // Mexican Peso
  KRW = "KRW", // South Korean Won
  SEK = "SEK", // Swedish Krona
  NOK = "NOK", // Norwegian Krone
  DKK = "DKK", // Danish Krone
  AED = "AED", // UAE Dirham
  KES = "KES" // Kenyan Shilling
}

export {
  BIT,
  USER_STATUS,
  PASSWORD_STATUS,
  GENDER,
  ACCOUNT_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_CHANNEL,
  TRANSACTION_STATUS,
  WALLET_TYPE,
  WALLET_TIER,
  WALLET_STATUS,
  CURRENCY
};
