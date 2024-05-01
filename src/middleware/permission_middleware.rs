// use actix_service::{forward_ready, Service, Transform};
// use actix_web::{
//     body::EitherBody,
//     dev::{ServiceRequest, ServiceResponse},
//     http::{
//         header::{HeaderName, HeaderValue},
//         Error, Method,
//     },
//     HttpResponse,
// };
// use futures::future::{ok, LocalBoxFuture, Ready};

// use crate::{models::response::ResponseBody, utils::constants};

// pub struct PermissionAuth;

// impl<S, B> Transform<S, ServiceRequest> for PermissionAuth
// where
//     S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
//     S::Future: 'static,
//     B: 'static,
// {
//     type Response = ServiceResponse<EitherBody<B>>;
//     type Error = Error;
//     type InitError = ();
//     type Transform = PermissionAuthMiddleware<S>;
//     type Future = Ready<Result<Self::Transform, Self::InitError>>;

//     fn new_transform(&self, service: S) -> Self::Future {
//         ok(PermissionAuthMiddleware { service })
//     }
// }

// pub struct PermissionAuthMiddleware<S> {
//     service: S,
// }

// impl<S, B> Service<ServiceRequest> for PermissionAuthMiddleware<S>
// where
//     S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
//     S::Future: 'static,
//     B: 'static,
// {
//     type Response = ServiceResponse<EitherBody<B>>;
//     type Error = Error;
//     type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

//     forward_ready!(service);

//     fn call(&self, req: ServiceRequest) -> Self::Future {
//         // let mut authenticate_pass: bool = false;

//         // // Bypass some account routes
//         // let mut headers = req.headers().clone();
//         // headers.append(
//         //     HeaderName::from_static("content-length"),
//         //     HeaderValue::from_static("true"),
//         // );
//         // if Method::OPTIONS == *req.method() {
//         //     authenticate_pass = true;
//         // } else {
//         //     for ignore_route in constants::IGNORE_ROUTES.iter() {
//         //         if req.path().starts_with(ignore_route) {
//         //             authenticate_pass = true;
//         //             break;
//         //         }
//         //     }
//         // }

//         // if !authenticate_pass {
//         //     println!("Checking Permissions....")
//         // }

//         // if !authenticate_pass {
//         //     let (request, _pl) = req.into_parts();
//         //     let response = HttpResponse::Unauthorized()
//         //         .json(ResponseBody::new(
//         //             constants::PERMISSION_DENIED,
//         //             constants::EMPTY,
//         //         ))
//         //         .map_into_right_body();

//         //     return Box::pin(async { Ok(ServiceResponse::new(request, response)) });
//         // }

//         // println!("Permissions passed....");

//         // let res = self.service.call(req);

//         // Box::pin(async move { res.await.map(ServiceResponse::map_into_left_body) })

//         todo!("Implementar a verificação de permissões")
//     }
// }
