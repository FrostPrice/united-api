use actix_web::{
    http::{header::HeaderValue, StatusCode},
    web,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{
    config::db::Pool,
    models::{
        user::{LoginDTO, User},
        user_token::UserToken,
    },
    utils::{constants, error::ServiceError, token_utils},
};

#[derive(Serialize, Deserialize)]
pub struct TokenBodyResponse {
    pub token: String,
    pub token_type: String,
    pub username: String,
    pub email: String,
}

pub async fn login(
    login: LoginDTO,
    pool: &web::Data<Pool>,
) -> Result<TokenBodyResponse, ServiceError> {
    match User::login(login, &mut pool.get().unwrap()) {
        Some(logged_user) => {
            match serde_json::from_value(json!({
                "token": UserToken::generate_token(&logged_user),
                "token_type": "bearer",
                "username": logged_user.username,
                "email": logged_user.email
            })) {
                Ok(token_res) => {
                    if logged_user.login_session.is_empty() {
                        Err(ServiceError::new(
                            StatusCode::UNAUTHORIZED,
                            constants::MESSAGE_LOGIN_FAILED.to_string(),
                        ))
                    } else {
                        Ok(token_res)
                    }
                }
                Err(_) => Err(ServiceError::new(
                    StatusCode::INTERNAL_SERVER_ERROR,
                    constants::MESSAGE_INTERNAL_SERVER_ERROR.to_string(),
                )),
            }
        }
        None => Err(ServiceError::new(
            StatusCode::UNAUTHORIZED,
            constants::MESSAGE_USER_NOT_FOUND.to_string(),
        )),
    }
}

pub async fn logout(
    authen_header: &HeaderValue,
    pool: &web::Data<Pool>,
) -> Result<(), ServiceError> {
    if let Ok(authen_str) = authen_header.to_str() {
        if authen_str.starts_with("bearer") || authen_str.starts_with("Bearer") {
            let token = authen_str[6..authen_str.len()].trim();
            if let Ok(token_data) = token_utils::decode_token(token.to_string()) {
                if let Ok(username) = token_utils::verify_token(&token_data, pool) {
                    if let Ok(user) = User::find_by_username(&username, &mut pool.get().unwrap()) {
                        User::logout(user.id, &mut pool.get().unwrap());
                        return Ok(());
                    }
                }
            }
        }
    }

    Err(ServiceError::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        constants::MESSAGE_PROCESS_TOKEN_ERROR.to_string(),
    ))
}

pub async fn check(
    authen_header: &HeaderValue,
    pool: &web::Data<Pool>,
) -> Result<TokenBodyResponse, ServiceError> {
    if let Ok(authen_str) = authen_header.to_str() {
        if authen_str.starts_with("bearer") || authen_str.starts_with("Bearer") {
            let token = authen_str[6..authen_str.len()].trim();
            if let Ok(token_data) = token_utils::decode_token(token.to_string()) {
                if let Ok(username) = token_utils::verify_token(&token_data, pool) {
                    if let Ok(user) = User::find_by_username(&username, &mut pool.get().unwrap()) {
                        return Ok(TokenBodyResponse {
                            token: token.to_string(),
                            token_type: "bearer".to_string(),
                            username: user.username,
                            email: user.email,
                        });
                    }
                }
            }
        }
    }

    Err(ServiceError::new(
        StatusCode::INTERNAL_SERVER_ERROR,
        constants::MESSAGE_PROCESS_TOKEN_ERROR.to_string(),
    ))
}
