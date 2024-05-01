use crate::{
    config::db::Connection,
    utils::schema::login_history::{self, dsl::*},
};
use chrono::Utc;
use diesel::{QueryResult, RunQueryDsl};

use super::user::User;

#[derive(Identifiable, Associations, Queryable)]
#[diesel(check_for_backend(Db))]
#[diesel(belongs_to(User))]
#[diesel(table_name = login_history)]
pub struct LoginHistory {
    id: i32,
    user_id: i32,
    pub login_timestamp: chrono::NaiveDateTime,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = login_history)]
pub struct LoginHistoryInsertableDTO {
    user_id: i32,
    login_timestamp: chrono::NaiveDateTime,
}

impl LoginHistory {
    pub fn create(username: &str, conn: &mut Connection) -> Option<LoginHistoryInsertableDTO> {
        if let Ok(user) = User::find_by_username(username, conn) {
            let now = Utc::now();
            Some(LoginHistoryInsertableDTO {
                user_id: user.id,
                login_timestamp: now.naive_utc(),
            })
        } else {
            None
        }
    }

    pub fn save_login_history(
        login_history_record: LoginHistoryInsertableDTO,
        conn: &mut Connection,
    ) -> QueryResult<usize> {
        diesel::insert_into(login_history)
            .values(&login_history_record)
            .execute(conn)
    }

    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<LoginHistory>> {
        login_history.load::<LoginHistory>(conn)
    }
}
