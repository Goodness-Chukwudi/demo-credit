
const SESSION_EXPIRED = {
    code: 1,
    message: "Session expired. Please login again",
}

const INVALID_TOKEN = {
    code: 2,
    message: "Unable to authenticate request. Please login to continue"
}

const INVALID_SESSION_USER = {
    code: 3,
    message: "Unauthenticated user session. Please login again"
}

const EMAIL_REQUIRED = {
    code: 4,
    message: "Email is required"
}

const USER_NOT_FOUND = {
    code: 5,
    message: "User not found"
}

const PASSWORD_MISMATCH = {
    code: 6,
    message: "Passwords do not match"
}

const NEW_PASSWORD_REQUIRED = {
    code: 7,
    message: "New password required"
}

const INVALID_LOGIN = {
    code: 8,
    message: "Invalid email or password"
}

const DUPLICATE_EMAIL = {
    code: 9,
    message: "A user with this email already exist, please try a different email"
}

export {
    SESSION_EXPIRED,
    INVALID_TOKEN,
    INVALID_SESSION_USER,
    EMAIL_REQUIRED,
    USER_NOT_FOUND,
    PASSWORD_MISMATCH,
    NEW_PASSWORD_REQUIRED,
    INVALID_LOGIN,
    DUPLICATE_EMAIL
}