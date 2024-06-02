const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/grades.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/grades", [checkSession], controller.get);
  app.get("/api/grades/:id", [checkSession], controller.findById);
  app.post("/api/grades", [checkSession, isAdmin], controller.post);
  app.put("/api/grades/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/grades/:id", [checkSession, isAdmin], controller.delete);
};
