const firestore = require("../firebase-config");
const { isValid, docExist: itExist, docExist } = require("../utils/basics");
const menusSchema = require("../schemas/menus");

exports.read = async (req, res) => {
  /* #swagger.tags = ['Menus']
   #swagger.description = 'Service to get all menus from the database';
   #swagger.summary = "Service to get all menus from the database";
   #swagger.security = [{
            "bearerAuth": []
    }]
   #swagger.responses[200] = {
    description: 'return a list of all menus',
    schema: {
      type: 'array',
        items: {
            $ref: '#/definitions/Menus'
        }
    }
}
   #swagger.responses[500] = {
                description: 'Server Error',
                schema: {
    "message": "Internal server error",
   }
  } 
  */
  try {
    const menusList = await firestore.collection("Menus").get();
    return res.status(200).json(menusList.docs.map((doc) => doc.data()));
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Ouch!" });
  }
};

exports.getOneMenu = async (req, res) => {
  // #swagger.tags = ['Menus']
  //#swagger.security = [{
  //  "bearerAuth": []
  //}]
  // #swagger.description = 'Service to get one menu from the database';
  // #swagger.summary = "Service to get one menu from the database";
  /* 
    #swagger.responses[200]:{

    }
  */
  if (!req.params.menuId)
    return res
      .status(401)
      .send({ error: "You can't read a menu without a menu id." });

  const doc = await itExist("Menus", req.params.menuId);

  return res.status(200).send(doc.data());
};

exports.createMenus = async (req, res) => {
  // #swagger.tags = ['Menus']
  // #swagger.description = 'Service to create menus';
  // #swagger.summary = "Service to create menus and send to the database";
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
  // #swagger.tags = ['Menus']
  // #swagger.description = 'Service to delete a Menus';
  // #swagger.summary = "Service to delete" a Menu from the database;
  if (!req.body.menuId)
    return res.status(401).send({ error: "No id, no delete!" });
  const doc = await itExist("Menus", req.body.menuId);
  if (!doc)
    return res.status(404).send({ error: "This menu in not in our database" });
  await firestore
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
  // #swagger.tags = ['Menus']
  // #swagger.description = 'Service to get update a menu';
  // #swagger.summary = "Service to update a menu from the database";
  const data = req.body;
  const menu = await docExist("Menus", data.id);

  if (!menu) return res.status(404).send({ message: "Menu not found :-(" });

  const newMenu = {
    ...menu.data(),
    ...data,
  };
  if (!isValid(menusSchema, newMenu))
    return res.status(401).send({ error: "Your menu doesn't seem right" });
  await firestore
    .collection("Menus")
    .doc(data.id)
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
