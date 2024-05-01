use serde::Deserialize;

#[derive(Deserialize)]
pub struct HomologationFilter {
    pub vendor: Option<String>,
    pub model: Option<String>,
    pub firmware: Option<String>,
    pub homologated: Option<bool>,
    pub sort_by: Option<String>,
    pub sort_direction: Option<String>,
    pub page_num: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Deserialize)]
pub struct UserFilter {
    pub username: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub sort_by: Option<String>,
    pub sort_direction: Option<String>,
    pub page_num: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Deserialize)]
pub struct CustomerFilter {
    pub cnpj: Option<String>,
    pub company_name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub sort_by: Option<String>,
    pub sort_direction: Option<String>,
    pub page_num: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Deserialize)]
pub struct PocFilter {
    pub is_active: Option<bool>,
    pub termination_time: Option<chrono::NaiveDateTime>,
    pub ui_version: Option<String>,
    pub api_version: Option<String>,
    pub cwmp_version: Option<String>,
    pub customer_id: Option<i32>,
    pub sort_by: Option<String>,
    pub sort_direction: Option<String>,
    pub page_num: Option<i64>,
    pub page_size: Option<i64>,
}

#[derive(Deserialize)]
pub struct SubscriptionFilter {
    pub is_active: Option<bool>,
    pub ui_version: Option<String>,
    pub api_version: Option<String>,
    pub cwmp_version: Option<String>,
    pub customer_id: Option<i32>,
    pub sort_by: Option<String>,
    pub sort_direction: Option<String>,
    pub page_num: Option<i64>,
    pub page_size: Option<i64>,
}
