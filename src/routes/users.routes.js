const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/users.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/users", [checkSession, isAdmin], controller.get);
  app.get("/api/users/:id", [checkSession], controller.findById);
  app.put("/api/users/:id", [checkSession], controller.put);
  app.delete("/api/users/:id", [checkSession, isAdmin], controller.delete);
};
