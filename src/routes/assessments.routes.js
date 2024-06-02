const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/assessments.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/assessments", [checkSession], controller.get);
  app.get("/api/assessments/:id", [checkSession], controller.findById);
  app.post("/api/assessments", [checkSession, isAdmin], controller.post);
  app.put("/api/assessments/:id", [checkSession, isAdmin], controller.put);
  app.delete(
    "/api/assessments/:id",
    [checkSession, isAdmin],
    controller.delete
  );
};
