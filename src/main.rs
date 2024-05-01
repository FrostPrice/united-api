extern crate actix_web;
#[macro_use]
extern crate log;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
extern crate actix_cors;
extern crate actix_rt;
extern crate bcrypt;
extern crate derive_more;
extern crate dotenv;
extern crate env_logger;
extern crate failure;
extern crate futures;
extern crate jsonwebtoken;
extern crate serde;

mod api;
mod config;
mod middleware;
mod models;
mod services;
mod utils;

use actix_cors::Cors;
use actix_service::Service;
use actix_web::{http, App, HttpServer};
use config::init;
use futures::FutureExt;
use std::io;

#[actix_rt::main]
async fn main() -> io::Result<()> {
    // Init API and DB Config
    let (app_url, pool) = init::init_config().await;

    // Start API Server
    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .send_wildcard()
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .app_data(actix_web::web::Data::new(pool.clone()))
            .wrap(actix_web::middleware::Logger::default())
            .wrap(middleware::auth_middleware::Authentication)
            .wrap_fn(|req, srv| srv.call(req).map(|res| res))
            .configure(config::app::config_services)
    })
    .bind(&app_url)?
    .run()
    .await
}
