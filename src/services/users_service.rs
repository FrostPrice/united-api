use crate::{
    config::db::Pool,
    models::{
        filters::UserFilter,
        response::Page,
        user::{User, UserDTO},
    },
    utils::constants,
    utils::error::ServiceError,
};
use actix_web::{http::StatusCode, web};

pub async fn find_all(pool: &web::Data<Pool>) -> Result<Vec<User>, ServiceError> {
    match User::find_all(&mut pool.get().unwrap()) {
        Ok(user) => Ok(user),
        Err(_) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            constants::MESSAGE_CAN_NOT_FETCH_DATA.to_string(),
        )),
    }
}

pub async fn find_by_id(id: i32, pool: &web::Data<Pool>) -> Result<User, ServiceError> {
    match User::find_by_id(id, &mut pool.get().unwrap()) {
        Ok(user) => Ok(user),
        Err(_) => Err(ServiceError::new(
            StatusCode::NOT_FOUND,
            format!("User with id {} not found", id),
        )),
    }
}

pub async fn filter(query: UserFilter, pool: &web::Data<Pool>) -> Result<Page<User>, ServiceError> {
    match User::filter(query, &mut pool.get().unwrap()) {
        Ok(user) => Ok(user),
        Err(_) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            constants::MESSAGE_CAN_NOT_FETCH_DATA.to_string(),
        )),
    }
}

pub async fn insert(user_dto: UserDTO, pool: &web::Data<Pool>) -> Result<(), ServiceError> {
    match User::insert(user_dto, &mut pool.get().unwrap()) {
        Ok(_) => Ok(()),
        Err(_) => Err(ServiceError::new(
            StatusCode::INTERNAL_SERVER_ERROR,
            constants::MESSAGE_CAN_NOT_INSERT_DATA.to_string(),
        )),
    }
}

pub async fn update(
    id: i32,
    updated_user: UserDTO,
    pool: &web::Data<Pool>,
) -> Result<(), ServiceError> {
    match User::find_by_id(id, &mut pool.get().unwrap()) {
        Ok(_) => match User::update(id, updated_user, &mut pool.get().unwrap()) {
            Ok(_) => Ok(()),
            Err(_) => Err(ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                constants::MESSAGE_CAN_NOT_UPDATE_DATA.to_string(),
            )),
        },
        Err(_) => Err(ServiceError::new(
            StatusCode::NOT_FOUND,
            format!("User with id {} not found", id),
        )),
    }
}

pub async fn delete(id: i32, pool: &web::Data<Pool>) -> Result<(), ServiceError> {
    match User::find_by_id(id, &mut pool.get().unwrap()) {
        Ok(_) => match User::delete(id, &mut pool.get().unwrap()) {
            Ok(_) => Ok(()),
            Err(_) => Err(ServiceError::new(
                StatusCode::INTERNAL_SERVER_ERROR,
                constants::MESSAGE_CAN_NOT_DELETE_DATA.to_string(),
            )),
        },
        Err(_) => Err(ServiceError::new(
            StatusCode::NOT_FOUND,
            format!("User with id {} not found", id),
        )),
    }
}

// pub async fn reset_password(
//     id: String,
//     body: Document,
//     pool: &web::Data<Pool>,
// ) -> Result<(), ServiceError> {
//     if let Some(new_password) = body.get_str("newPassword").ok() {
//         match User::find_by_id(id.clone(), &pool.get().unwrap()).await {
//             Ok(_) => {
//                 match User::reset_password(id, new_password.to_string(), &pool.get().unwrap()).await
//                 {
//                     Ok(_) => Ok(()),
//                     Err(_) => Err(ServiceError::new(
//                         StatusCode::INTERNAL_SERVER_ERROR,
//                         constants::MESSAGE_CAN_NOT_UPDATE_DATA.to_string(),
//                     )),
//                 }
//             }
//             Err(_) => Err(ServiceError::new(
//                 StatusCode::NOT_FOUND,
//                 format!("User with id {} not found", id),
//             )),
//         }
//     } else {
//         Err(ServiceError::new(
//             StatusCode::BAD_REQUEST,
//             format!("Missing newPassword parameter"),
//         ))
//     }
// }
