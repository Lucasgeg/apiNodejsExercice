module.exports = (app) => {
  const router = require("express").Router();
  const auth = require("../controllers/auth_controller");

  router.post("/register", auth.register);
  router.post("/login", auth.login);
  router.get("/me", auth.me);

  app.use("/menusapi/api/v1", router);
};
