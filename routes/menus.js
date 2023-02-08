const { isAuthorize, authenticateToken } = require("../middlewares/jwt");

module.exports = (app) => {
  const router = require("express").Router();
  const menus = require("../controllers/menus_controller");

  router.get("/menus", authenticateToken, menus.read);

  router.get("/menus/:menuId", authenticateToken, menus.getOneMenu);

  router.post("/createmenu", isAuthorize, menus.createMenus);

  router.delete("/deletemenu", isAuthorize, menus.delete);

  router.put("/updatemenu", isAuthorize, menus.update);

  app.use("/menusapi/api/v1", router);
};
