const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/notifications.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/notifications", [checkSession], controller.get);
  app.get("/api/notifications/:id", [checkSession], controller.findById);
  app.post("/api/notifications", [checkSession, isAdmin], controller.post);
  app.put("/api/notifications/:id", [checkSession], controller.put);
  app.delete(
    "/api/notifications/:id",
    [checkSession, isAdmin],
    controller.delete
  );
};
