use crate::{
    config::db::Connection,
    utils::schema::{
        login_history,
        users::{self, login_session, username},
    },
};
use bcrypt::{hash_with_result, verify, DEFAULT_COST};
use chrono;
use diesel::{ExpressionMethods, QueryDsl, QueryResult, RunQueryDsl};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{
    filters::UserFilter, login_history::LoginHistory, pagination::SortingAndPaging, response::Page,
    user_token::UserToken,
};

#[derive(Queryable, Serialize, Deserialize)]
#[diesel(check_for_backend(Db))]
#[diesel(table_name = crate::utils::schema::users)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    role: String,
    password: String,
    pub login_session: String,
    created_at: chrono::NaiveDateTime,
}

#[derive(Insertable, AsChangeset, Serialize, Deserialize)]
#[diesel(check_for_backend(Db))]
#[diesel(table_name = crate::utils::schema::users)]
pub struct UserDTO {
    pub username: String,
    pub role: String,
    pub password: String,
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginDTO {
    pub username: String,
    pub password: String,
}

#[derive(Insertable, Serialize, Deserialize)]
#[diesel(check_for_backend(Db))]
#[diesel(table_name = crate::utils::schema::users)]
pub struct LoginInfoDTO {
    pub username: String,
    pub email: String,
    pub login_session: String,
}

impl User {
    fn user_dto_with_hashed_password(updated_user: UserDTO) -> UserDTO {
        let hashed_result = hash_with_result(&updated_user.password, DEFAULT_COST).unwrap();

        UserDTO {
            password: hashed_result.to_string(),
            ..updated_user
        }
    }

    fn generate_login_session() -> String {
        Uuid::new_v4().as_simple().to_string()
    }

    fn update_login_session_to_db(
        un: &str,
        login_session_str: &str,
        conn: &mut Connection,
    ) -> bool {
        if let Ok(user) = Self::find_by_username(un, conn) {
            diesel::update(users::table.find(user.id))
                .set(users::login_session.eq(login_session_str.to_string()))
                .execute(conn)
                .is_ok()
        } else {
            false
        }
    }

    pub fn find_by_username(un: &str, conn: &mut Connection) -> QueryResult<User> {
        users::table
            .filter(users::username.eq(un))
            .or_filter(users::email.eq(un))
            .get_result::<User>(conn)
    }

    pub fn find_all(conn: &mut Connection) -> QueryResult<Vec<User>> {
        users::table.load::<User>(conn)
    }

    pub fn find_by_id(i: i32, conn: &mut Connection) -> QueryResult<User> {
        users::table.find(i).get_result::<User>(conn)
    }

    pub fn filter(q: UserFilter, conn: &mut Connection) -> QueryResult<Page<User>> {
        let mut query = users::table.into_boxed();

        if let Some(i) = q.username {
            query = query.filter(users::username.eq(i));
        }
        if let Some(i) = q.email {
            query = query.filter(users::email.eq(i));
        }
        if let Some(i) = q.role {
            query = query.filter(users::role.eq(i));
        }

        query
            .paginate(
                q.page_num
                    .unwrap_or(crate::utils::constants::DEFAULT_PAGE_NUM),
            )
            .per_page(
                q.page_size
                    .unwrap_or(crate::utils::constants::DEFAULT_PER_PAGE),
            )
            .sort(
                q.sort_by
                    .unwrap_or(crate::utils::constants::EMPTY_STR.to_string()),
                q.sort_direction
                    .unwrap_or(crate::utils::constants::EMPTY_STR.to_string()),
            )
            .load_and_count_items::<User>(conn)
    }

    pub fn insert(user_dto: UserDTO, conn: &mut Connection) -> QueryResult<User> {
        let user = Self::user_dto_with_hashed_password(user_dto);

        diesel::insert_into(users::table)
            .values(user)
            .get_result::<User>(conn)
    }

    pub fn update(i: i32, updated_user: UserDTO, conn: &mut Connection) -> QueryResult<usize> {
        let user = Self::user_dto_with_hashed_password(updated_user);

        diesel::update(users::table.find(i)).set(user).execute(conn)
    }

    pub fn delete(i: i32, conn: &mut Connection) -> QueryResult<usize> {
        diesel::delete(login_history::table.filter(login_history::user_id.eq(i))).execute(conn)?;
        diesel::delete(users::table.find(i)).execute(conn)
    }

    // pub async fn signup(user_dto: UserDTO, conn: &Database) -> Result<String, String> {
    //     if Self::find_user_by_username(&user_dto.username, conn)
    //         .await
    //         .is_err()
    //     {
    //         let collection = conn.collection::<User>("users");

    //         let hashed_result = hash_with_result(&user_dto.password, DEFAULT_COST).unwrap();
    //         let user_dto = UserDTO {
    //             password: hashed_result.to_string(),
    //             ..user_dto
    //         };

    //         let user = Self::from_dto(hashed_result, user_dto);

    //         collection.insert_one(user, None).await.unwrap();

    //         Ok(constants::MESSAGE_SIGNUP_SUCCESS.to_string())
    //     } else {
    //         Err(format!(
    //             "User '{}' is already registered",
    //             &user_dto.username
    //         ))
    //     }
    // }

    pub fn login(login: LoginDTO, conn: &mut Connection) -> Option<LoginInfoDTO> {
        if let Ok(user_to_verify) = users::table
            .filter(users::username.eq(&login.username))
            .or_filter(users::email.eq(&login.username))
            .get_result::<User>(conn)
        {
            if !user_to_verify.password.is_empty()
                && verify(&login.password, &user_to_verify.password).unwrap_or(false)
            {
                if let Some(login_history) = LoginHistory::create(&user_to_verify.username, conn) {
                    if LoginHistory::save_login_history(login_history, conn).is_err() {
                        return None;
                    }
                    let login_session_str = User::generate_login_session();
                    if User::update_login_session_to_db(
                        &user_to_verify.username,
                        &login_session_str,
                        conn,
                    ) {
                        return Some(LoginInfoDTO {
                            username: user_to_verify.username,
                            email: user_to_verify.email,
                            login_session: login_session_str,
                        });
                    }
                }
            } else {
                return Some(LoginInfoDTO {
                    username: user_to_verify.username,
                    email: user_to_verify.email,
                    login_session: String::new(),
                });
            }
        }

        None
    }

    pub fn logout(user_id: i32, conn: &mut Connection) {
        if let Ok(user) = User::find_by_id(user_id, conn) {
            Self::update_login_session_to_db(&user.username, "", conn);
        }
    }

    pub fn is_valid_login_session(user_token: &UserToken, conn: &mut Connection) -> bool {
        users::table
            .filter(username.eq(&user_token.user))
            .filter(login_session.eq(&user_token.login_session))
            .get_result::<User>(conn)
            .is_ok()
    }

    // pub async fn find_by_login_session(
    //     user_token: &UserToken,
    //     conn: &Database,
    // ) -> Option<Document> {
    //     let collection = conn.collection("users");
    //     let filter = doc! {
    //         "login_session": user_token.login_session.clone(),
    //     };

    //     collection.find_one(filter, None).await.unwrap_or(None)
    // }

    // pub async fn reset_password(
    //     id: String,
    //     new_password: String,
    //     conn: &Database,
    // ) -> Result<String, String> {
    //     let collection = conn.collection::<User>("users");

    //     let hashed_result = hash_with_result(&new_password, DEFAULT_COST).unwrap();

    //     let query = doc! { "_id" : id };
    //     let update = doc! {
    //         "$set": doc! {
    //             "password": hashed_result.to_string(),
    //             "salt": hashed_result.get_salt(),
    //         }
    //     };

    //     match collection.update_one(query, update, None).await {
    //         Ok(_) => Ok(format!("Password changed")),
    //         Err(err) => Err(err.to_string()),
    //     }
    // }
}
