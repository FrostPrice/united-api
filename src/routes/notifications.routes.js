const controller = require("../controllers/notifications.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/notifications", [], controller.get);
  app.get("/notifications/:id", [], controller.findById);
  app.put("/notifications/:id", [], controller.put);
};
