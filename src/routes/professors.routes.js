const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/professors.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/professors", [checkSession], controller.get);
  app.get("/api/professors/:id", [checkSession], controller.findById);
  app.post("/api/professors", [checkSession, isAdmin], controller.post);
  app.put("/api/professors/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/professors/:id", [checkSession, isAdmin], controller.delete);
};
