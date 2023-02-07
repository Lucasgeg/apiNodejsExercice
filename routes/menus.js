const { isAuthorize } = require("../middlewares/jwt");

module.exports = (app) => {
  const router = require("express").Router();
  const menus = require("../controllers/menus_controller");
  router.post("/createmenus", isAuthorize, menus.createMenus);

  app.use("/menusapi/api/v1", router);
};
