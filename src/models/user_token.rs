use super::user::LoginInfoDTO;
use chrono::Utc;
use jsonwebtoken::{EncodingKey, Header};
use serde::{Deserialize, Serialize};

pub static KEY: [u8; 16] = *include_bytes!("../secret.key");
static ONE_WEEK: i64 = 60 * 60 * 24 * 7; // In Seconds

#[derive(Serialize, Deserialize)]
pub struct UserToken {
    // Issued at
    pub iat: i64,
    // Expiration
    pub exp: i64,
    // Data
    pub user: String,
    pub login_session: String,
    // pub permissions: Vec<String>,
}
impl UserToken {
    pub fn generate_token(login: &LoginInfoDTO) -> String {
        let now = Utc::now().timestamp_nanos_opt().unwrap() / 1_000_000_000; // Nanosecods -> Seconds

        let payload = UserToken {
            iat: now,
            exp: now + ONE_WEEK, // 7 days
            user: login.username.clone(),
            login_session: login.login_session.clone(),
        };

        jsonwebtoken::encode(
            &Header::default(),
            &payload,
            &EncodingKey::from_secret(&KEY),
        )
        .unwrap()
    }
}
