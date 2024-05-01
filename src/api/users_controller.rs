use crate::{
    config::db::Pool,
    models::{filters::UserFilter, response::ResponseBody, user::UserDTO},
    services::users_service,
    utils::constants,
};
use actix_web::{web, HttpResponse, Result};

// GET api/users
pub async fn find_all(pool: web::Data<Pool>) -> Result<HttpResponse> {
    match users_service::find_all(&pool).await {
        Ok(user) => Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, user))),
        Err(err) => Ok(err.response()),
    }
}

// GET api/users/{id}
pub async fn find_by_id(id: web::Path<i32>, pool: web::Data<Pool>) -> Result<HttpResponse> {
    match users_service::find_by_id(id.into_inner(), &pool).await {
        Ok(user) => Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, user))),
        Err(err) => Ok(err.response()),
    }
}

// GET /api/users?filter1=string&filter2=string...
pub async fn filter(
    web::Query(query): web::Query<UserFilter>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse> {
    match users_service::filter(query, &pool).await {
        Ok(page) => Ok(HttpResponse::Ok().json(page)),
        Err(err) => Ok(err.response()),
    }
}

// POST api/users
pub async fn insert(user_dto: web::Json<UserDTO>, pool: web::Data<Pool>) -> Result<HttpResponse> {
    match users_service::insert(user_dto.0, &pool).await {
        Ok(()) => Ok(HttpResponse::Created()
            .json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY))),
        Err(err) => Ok(err.response()),
    }
}

// PUT api/users/{id}
pub async fn update(
    id: web::Path<i32>,
    updated_user: web::Json<UserDTO>,
    pool: web::Data<Pool>,
) -> Result<HttpResponse> {
    match users_service::update(id.into_inner(), updated_user.0, &pool).await {
        Ok(()) => {
            Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
        }
        Err(err) => Ok(err.response()),
    }
}

// DELETE api/users/{id}
pub async fn delete(id: web::Path<i32>, pool: web::Data<Pool>) -> Result<HttpResponse> {
    match users_service::delete(id.into_inner(), &pool).await {
        Ok(()) => {
            Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
        }
        Err(err) => Ok(err.response()),
    }
}

// // PUT api/users/{id}/reset_password
// pub async fn reset_password(
//     id: web::Path<String>,
//     body: web::Json<Document>,
//     pool: web::Data<Pool>,
// ) -> Result<HttpResponse> {
//     match users_service::reset_password(id.into_inner(), body.0, &pool).await {
//         Ok(()) => {
//             Ok(HttpResponse::Ok().json(ResponseBody::new(constants::MESSAGE_OK, constants::EMPTY)))
//         }
//         Err(err) => Ok(err.response()),
//     }
// }
