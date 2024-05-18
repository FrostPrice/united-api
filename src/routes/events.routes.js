const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/events.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/events", [checkSession], controller.get);
  app.get("/api/events/:id", [checkSession], controller.findById);
  app.post("/api/events", [checkSession, isAdmin], controller.post);
  app.put("/api/events/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/events/:id", [checkSession, isAdmin], controller.delete);
};
