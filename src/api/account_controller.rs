use actix_web::{web, HttpRequest, HttpResponse, Result};

use crate::{
    config::db::Pool,
    models::{response::ResponseBody, user::LoginDTO},
    services::account_service,
    utils::constants,
};

// POST api/auth/login
pub async fn login(login_dto: web::Json<LoginDTO>, pool: web::Data<Pool>) -> Result<HttpResponse> {
    match account_service::login(login_dto.0, &pool).await {
        Ok(token_res) => Ok(HttpResponse::Ok().json(ResponseBody::new(
            constants::MESSAGE_LOGIN_SUCCESS,
            token_res,
        ))),
        Err(err) => Ok(err.response()),
    }
}

// POST api/auth/logout
pub async fn logout(req: HttpRequest, pool: web::Data<Pool>) -> Result<HttpResponse> {
    if let Some(authen_header) = req.headers().get(constants::AUTHORIZATION) {
        let _ = account_service::logout(authen_header, &pool).await;

        Ok(HttpResponse::Ok().json(ResponseBody::new(
            constants::MESSAGE_LOGOUT_SUCCESS,
            constants::EMPTY,
        )))
    } else {
        Ok(HttpResponse::BadRequest().json(ResponseBody::new(
            constants::MESSAGE_TOKEN_MISSING,
            constants::EMPTY,
        )))
    }
}

// GET api/auth/check
pub async fn check(req: HttpRequest, pool: web::Data<Pool>) -> Result<HttpResponse> {
    if let Some(authen_header) = req.headers().get(constants::AUTHORIZATION) {
        match account_service::check(authen_header, &pool).await {
            Ok(user) => Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, user))),
            Err(err) => Ok(err.response()),
        }
    } else {
        Ok(HttpResponse::BadRequest().json(ResponseBody::new(
            constants::MESSAGE_INVALID_TOKEN,
            constants::EMPTY,
        )))
    }
}
