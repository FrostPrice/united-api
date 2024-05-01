use std::env;

use crate::{
    config::db::{Connection, Pool},
    models::user,
};

pub async fn init_config() -> (String, Pool) {
    dotenv::dotenv().expect("Failed to read .env file");
    env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    let app_host = env::var("APP_HOST").expect("APP_HOST not found.");
    let app_port = env::var("APP_PORT").expect("APP_PORT not found.");
    let app_url = format!("{}:{}", &app_host, &app_port);
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL not found.");
    let default_username = env::var("DEFAULT_USERNAME").expect("DEFAULT_USERNAME not found.");
    let default_password = env::var("DEFAULT_PASSWORD").expect("DEFAULT_PASSWORD not found.");
    let default_email = env::var("DEFAULT_EMAIL").expect("DEFAULT_EMAIL not found.");

    let pool = super::db::migrate_and_config_db(&db_url);

    let _ = create_default_user(default_username, default_password, default_email, &pool);

    (app_url, pool)
}

fn create_default_user(
    username: impl Into<String>,
    password: impl Into<String>,
    email: impl Into<String>,
    pool: &Pool,
) -> bool {
    let conn: &mut Connection = &mut pool.get().unwrap();

    let user_dto = user::UserDTO {
        username: username.into(),
        password: password.into(),
        email: email.into(),
        role: "admin".to_string(),
    };

    if user::User::find_by_username(&user_dto.username, conn).is_ok() {
        info!("Default user already exists.");
        return false;
    }

    match user::User::insert(user_dto, conn) {
        Ok(_) => {
            info!("Default user created.");
            true
        }
        Err(_) => {
            error!("Error creating default user.");
            false
        }
    }
}
