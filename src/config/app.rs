use crate::api::*;
use actix_web::web;

pub fn config_services(cfg: &mut web::ServiceConfig) {
    info!("Configuring routes...");

    cfg.service(
        web::scope("/api")
            .service(
                web::scope("/auth")
                    .service(
                        web::resource("/login").route(web::post().to(account_controller::login)),
                    )
                    .service(
                        web::resource("/logout").route(web::post().to(account_controller::logout)),
                    )
                    .service(
                        web::resource("/check").route(web::post().to(account_controller::check)),
                    ),
            )
            .service(
                web::scope("/users")
                    .service(
                        web::resource("")
                            .guard(actix_web::guard::fn_guard(|req| {
                                req.head().uri.query().is_some()
                            }))
                            .route(web::get().to(users_controller::filter)),
                    )
                    .service(
                        web::resource("")
                            .route(web::get().to(users_controller::find_all))
                            .route(web::post().to(users_controller::insert)),
                    )
                    .service(
                        web::resource("/{id}")
                            .route(web::get().to(users_controller::find_by_id))
                            .route(web::put().to(users_controller::update))
                            .route(web::delete().to(users_controller::delete)),
                    ),
            ),
    );
}
