const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/enrollments.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/enrollments", [checkSession], controller.get);
  app.get("/api/enrollments/:id", [checkSession], controller.findById);
  app.post("/api/enrollments", [checkSession, isAdmin], controller.post);
  app.put("/api/enrollments/:id", [checkSession, isAdmin], controller.put);
  app.delete(
    "/api/enrollments/:id",
    [checkSession, isAdmin],
    controller.delete
  );
};
