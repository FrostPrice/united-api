const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/courses.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/courses", [checkSession], controller.get);
  app.get("/api/courses/:id", [checkSession], controller.findById);
  app.post("/api/courses", [checkSession, isAdmin], controller.post);
  app.put("/api/courses/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/courses/:id", [checkSession, isAdmin], controller.delete);
};
