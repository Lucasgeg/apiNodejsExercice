const { isValid } = require("../utils/basics");
const menusSchema = require("../schemas/menus");

// TODO: create db collection
// TODO: add to collection the menu
// TODO: update the collection and add id

exports.createMenus = async (req, res) => {
  console.log("toto");
  const data = req.body;
  if (!isValid(menusSchema, data))
    return res.status(403).send({ menuError: "Your menus is not allowed" });
  return res.status(200).json({ message: "Well done! there is your menu!" });
};
