const controller = require("../controllers/events.controller.js");

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

  app.get("/events", [], controller.get);
  app.get("/events/:id", [], controller.findById);
  app.put("/events/:id", [], controller.put);
  app.delete("/events/:id", [], controller.delete);
};
