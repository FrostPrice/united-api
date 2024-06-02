const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/subjects.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/subjects", [checkSession], controller.get);
  app.get("/api/subjects/:id", [checkSession], controller.findById);
  app.post("/api/subjects", [checkSession, isAdmin], controller.post);
  app.put("/api/subjects/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/subjects/:id", [checkSession, isAdmin], controller.delete);
};
