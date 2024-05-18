const controller = require("../controllers/auth.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/auth/check", [], controller.checkSession);
  app.post("/api/auth/login", [], controller.login);
  app.post("/api/auth/logout", [], controller.logout);
  app.post("/api/auth/register", [], controller.register);
};
