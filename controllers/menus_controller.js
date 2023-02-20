const firestore = require("../firebase-config");
const { isValid, docExist } = require("../utils/basics");
const { menusSchema, updateMenuSchema } = require("../schemas/menus");
const { ERROR_MESSAGES, COLLECTIONS } = require("../utils/enum");

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

    #swagger.responses[401] = {
                description: 'Invalid token',
                schema: {
    "message": "Your rights are revoked",
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
    const menusList = await firestore.collection(COLLECTIONS.MENUS).get();
    return res.status(200).json(menusList.docs.map((doc) => doc.data()));
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: {
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    });
  }
};

exports.getOneMenu = async (req, res) => {
  /* #swagger.tags = ['Menus']
  
   #swagger.description = 'Service to get one menu from the database';
   #swagger.summary = "Service to get one menu from the database";
   
       #swagger.security = [{
         "bearerAuth": []
   }]
  
  #swagger.responses[200] = {
    description: 'Return the detail of the menu founded by its ID',
    schema: {
      $ref: '#/definitions/Menus'
    }
  }

   #swagger.responses[401] = {
                description: 'Invalid token',
                schema: {
    "message": "Your rights are revoked",
   }
  } 

  #swagger.responses[404] = {
    description: 'Not found error',
    schema: {
      "message": "Not found, try again!"
    }
  }
  #swagger.responses[500] = {
    description: 'Server Error',
    schema: {
      "message": "Internal server error"
    }
  }
   #swagger.parameters['menuId'] = {
    in: 'path',
    description: 'ID of menu',
    required: true,
    type: 'string'
  }
}
  */
  if (!req.params.menuId)
    return res.status(401).send({ error: ERROR_MESSAGES.MISSING_MENU_ID });

  const doc = await docExist(COLLECTIONS.MENUS, req.params.menuId);

  if (!doc) {
    return res.status(404).send({ error: ERROR_MESSAGES.NOT_FOUND });
  }

  return res.status(200).send(doc.data());
};

// TODO: Explain where the admin privilege is needed

exports.createMenus = async (req, res) => {
  /* #swagger.tags = ['Menus']
   #swagger.description = 'Service to create menus';
   #swagger.summary = "Service to create menus and send to the database";
    #swagger.security = [{
    "bearerAuth": []
}] 

  #swagger.parameters['obj'] = {
          in: 'body',
          description: 'Menu creation',
          schema: { $ref: "#/definitions/Menus" }
     }
    } 

   #swagger.responses[200] = {
    description: 'Menu creation success',
    schema: {
      type: 'object',
        items: {
            $ref: '#/definitions/Menus'
        }
    }
  }
    #swagger.responses[400] = {
                description: 'Invalid or insufficient data',
                schema: {
    "message": "Invalid or insufficient data",
   }
  }

   #swagger.responses[401] = {
                description: 'Invalid token',
                schema: {
    "message": "Your rights are revoked",
   }
  } 

  } 

   #swagger.responses[500] = {
                description: 'Server Error',
                schema: {
    "message": "Internal server error",
   }
   } */
  const data = req.body;
  if (!(await isValid(menusSchema, data)))
    return res.status(400).send({ menuError: ERROR_MESSAGES.INVALID_DATA });
  try {
    const docRef = await firestore.collection(COLLECTIONS.MENUS).add(data);
    await firestore
      .collection(COLLECTIONS.MENUS)
      .doc(docRef.id)
      .update({ id: docRef.id });

    return res.status(200).send({
      message: "Menu created successfully!",
      menuId: docRef.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.delete = async (req, res) => {
  /* #swagger.tags = ['Menus']

   #swagger.description = 'Service to delete a Menus';

   #swagger.summary = "Service to delete" a Menu from the database;
   
    #swagger.security = [{
    "bearerAuth": []
    }]

    #swagger.parameters['obj'] = {
          in: 'body',
          description: 'Id of the menu to delete',
          schema: { 
            menuId: "string"
           }
     }
  } 
  #swagger.responses[200] = {
    description: 'Menu deletion success',
    schema: {
      "message": "Menu deletion successful"
    }
  }
    #swagger.responses[400] = {
                description: 'Invalid or insufficient data',
                schema: {
    "message": "Invalid or insufficient data",
   }
  }

   #swagger.responses[401] = {
                description: 'Invalid token',
                schema: {
    "message": "Your rights are revoked",
   }
  } 

   #swagger.responses[500] = {
                description: 'Server Error',
                schema: {
    "message": "Internal server error",
   }
   } */
  const menuId = req.body.menuId;

  // Validation de l'ID de menu
  if (!menuId) {
    return res.status(400).send({ error: ERROR_MESSAGES.INVALID_DATA });
  }

  // Vérification de l'existence du menu dans la base de données
  try {
    const doc = await firestore.collection(COLLECTIONS.MENUS).doc(menuId).get();
    if (!doc.exists) {
      return res.status(404).send({ error: ERROR_MESSAGES.NOT_FOUND });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: ERROR_MESSAGES.SERVER_ERROR });
  }

  // Suppression du menu dans la base de données
  try {
    await firestore.collection(COLLECTIONS.MENUS).doc(menuId).delete();
    return res.status(200).send({ message: "Menu deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: ERROR_MESSAGES.SERVER_ERROR });
  }
};

exports.update = async (req, res) => {
  /* #swagger.tags = ['Menus']

   #swagger.description = 'Service to get update a menu';

   #swagger.summary = "Service to update a menu from the database";

   
    #swagger.parameters['obj'] = {
          in: 'body',
          description: 'New menu, only Id is required',
          schema: { $ref: "#/definitions/MenuUpdate" }
     }


    #swagger.security = [{
    "bearerAuth": []
}] 
  #swagger.responses[200] = {
    description: 'Menu update success',
    schema: {
      "message": "Menu update successful"
    }}
    #swagger.responses[400] = {
                description: 'Invalid or insufficient data',
                schema: {
    "message": "Invalid or insufficient data",
   }}

    #swagger.responses[401] = {
                description: 'Invalid token',
                schema: {
    "message": "Your rights are revoked",
   }
  } 

    #swagger.responses[404] = {
                description: 'Not Found',
                schema: {
    "message": "Not found, sorry!",
   }}
   #swagger.responses[500] = {
                description: 'Server Error',
                schema: {
    "message": "Internal server error",
   }} */
  const data = req.body;
  const menu = await docExist(COLLECTIONS.MENUS, data.id);

  if (!menu) return res.status(404).send({ message: ERROR_MESSAGES.NOT_FOUND });

  const newMenu = {
    ...menu.data(),
    ...data,
  };
  if (!(await isValid(updateMenuSchema, newMenu)))
    return res.status(400).send({ error: ERROR_MESSAGES.INVALID_DATA });
  try {
    await firestore.collection(COLLECTIONS.MENUS).doc(data.id).update(newMenu);
    return res.status(200).send({ success: "Menu updated successfully" });
  } catch (error) {
    console.log(err);
    return res.status(500).send({ error: ERROR_MESSAGES.SERVER_ERROR });
  }
};
