
const USER_LABEL = "user";
const LOGIN_SESSION_LABEL = "login_session";
const INPUT_VALIDATION_ERROR = "One or more validation errors occurred";
const USER_SESSION = "ACTIVE_USER_SESSION-";
const ONE_DAY = 86400;
enum TABLES {
    User = "users",
    Password = "passwords",
    LoginSession = "login_sessions"
}

export {
    USER_LABEL,
    LOGIN_SESSION_LABEL,
    TABLES,
    INPUT_VALIDATION_ERROR,
    USER_SESSION,
    ONE_DAY
};