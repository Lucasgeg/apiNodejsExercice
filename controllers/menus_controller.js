const firestore = require("../firebase-config");
const { isValid } = require("../utils/basics");
const menusSchema = require("../schemas/menus");

// TODO: create db collection
// TODO: add to collection the menu
// TODO: update the collection and add id

exports.read = async (req, res) => {
  try {
    const menusList = await firestore.collection("Menus").get();
    return res.status(200).json(menusList.docs.map((doc) => doc.data()));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Ouch!" });
  }
};

exports.getOneMenu = async (req, res) => {
  if (!req.body.menuId)
    return res
      .status(401)
      .send({ error: "You can't read a menu without a menu id." });
  try {
    const menu = firestore.collection("Menus").where("id", "==", req.menuId);
    if (!menu)
      return res
        .status(404)
        .send({ error: "404 not found the mitical status!" });
    return res.status(200).json(menu.docs(whe));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Ouch!" });
  }
};

exports.createMenus = async (req, res) => {
  const data = req.body;
  if (!isValid(menusSchema, data))
    return res.status(403).send({ menuError: "Your menus is not allowed" });
  firestore
    .collection("Menus")
    .add(data)
    .then((docRef) => {
      firestore
        .collection("Menus")
        .doc(docRef.id)
        .update({ id: docRef.id })
        .then(() => {
          return res.status(200).send({
            message: "Well done! there is your menuId!",
            menuId: docRef.id,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({ message: "what's happening?" });
        });
    });
};

exports.delete = async (req, res) => {
  if (!req.body.menuId)
    return res.status(401).send({ error: "No id, no delete!" });

  firestore
    .collection("Menus")
    .doc(req.body.menuId)
    .delete()
    .then(() => {
      return res.status(200).send({ message: "Menu deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).send({
        message: "Menu can't be deleted, maybe it's already deleted?",
      });
    });
};

exports.update = async (req, res) => {
  console.log("toto");
  await res.send({ titi: "toto" });
  const data = req.body;
  const menuToModify = await firestore
    .collection("Menus")
    .where("id", "==", data.menuId);

  if (!menuToModify)
    return res.status(404).send({ error: "404 not found the mitical status!" });

  const newMenu = {
    ...menuToModify,
    ...data,
  };

  if (!isValid(menusSchema, newMenu))
    return res.status(401).send({ error: "Your menu doesn't seem right" });
  await firestore
    .collection("Menus")
    .doc(data.menuId)
    .update({
      ...newMenu,
    })
    .then(() => {
      return res.status(200).send({ success: "Menu updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "look like to get an error :-(" });
    });
};
