
enum BIT {
    ON = "1",
    OFF = "0"
}

enum USER_STATUS {
    ACTIVE = "active",
    DEACTIVATED = "deactivated",
    DELETED = "deleted",
    PENDING = "pending",
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
    WALLET_STATUS
}