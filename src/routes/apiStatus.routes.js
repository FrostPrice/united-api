const controller = require("../controllers/apiStatus.controller.js");
const { checkSession } = require("../middlewares/authSession.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api-status", [], controller.get);
};
