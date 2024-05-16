const controller = require("../controllers/auth.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/auth/check", [], controller.checkSession);
  app.post("/auth/login", [], controller.login);
  app.post("/auth/logout", [], controller.logout);
  app.post("/auth/register", [], controller.register);
};
