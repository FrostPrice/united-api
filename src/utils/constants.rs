// Messages
pub const MESSAGE_OK: &str = "ok";
pub const MESSAGE_CAN_NOT_FETCH_DATA: &str = "cannot_fetch_data";
pub const MESSAGE_CAN_NOT_INSERT_DATA: &str = "cannot_insert_data";
pub const MESSAGE_CAN_NOT_UPDATE_DATA: &str = "cannot_update_data";
pub const MESSAGE_CAN_NOT_DELETE_DATA: &str = "cannot_delete_data";
// pub const MESSAGE_SIGNUP_SUCCESS: &str = "signup_successfully";
// pub const MESSAGE_SIGNUP_FAILED: &str = "Error while signing up, please try again";
pub const MESSAGE_LOGIN_SUCCESS: &str = "login_successfully";
pub const MESSAGE_LOGIN_FAILED: &str = "wrong_username_or_password";
pub const MESSAGE_USER_NOT_FOUND: &str = "wrong_username_or_password";
pub const MESSAGE_LOGOUT_SUCCESS: &str = "logout_successfully";
pub const MESSAGE_PROCESS_TOKEN_ERROR: &str = "error_while_processing_token";
pub const MESSAGE_INVALID_TOKEN: &str = "invalid_token_please_login_again";
pub const MESSAGE_INTERNAL_SERVER_ERROR: &str = "internal_server_error";

// Bad request messages
pub const MESSAGE_TOKEN_MISSING: &str = "token_is_missing";
// pub const PERMISSION_DENIED: &str = "permission_denied";

// Headers
pub const AUTHORIZATION: &str = "authorization";

// Misc
pub const EMPTY: &str = "";

// ignore routes
pub const IGNORE_ROUTES: [&str; 2] = ["/api/status", "/api/auth/login"];

// Default number of items per page
pub const DEFAULT_PER_PAGE: i64 = 20;

// Default page number
pub const DEFAULT_PAGE_NUM: i64 = 1;

pub const EMPTY_STR: &str = "";
