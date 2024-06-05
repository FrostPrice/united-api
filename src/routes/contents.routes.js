const { checkSession, isAdmin } = require("../middlewares/authSession.js");
const controller = require("../controllers/contents.controller.js");

/**
 * @param {import("express").Application} app
 */
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/contents", [checkSession], controller.get);
  app.get("/api/contents/:id", [checkSession], controller.findById);
  app.post("/api/contents", [checkSession, isAdmin], controller.post);
  app.put("/api/contents/:id", [checkSession, isAdmin], controller.put);
  app.delete("/api/contents/:id", [checkSession, isAdmin], controller.delete);
};
