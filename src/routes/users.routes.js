const controller = require("../controllers/users.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/users", [], controller.get);
  app.get("/users/:id", [], controller.findById);
  app.put("/users/:id", [], controller.put);
};
