const Ajv = require("ajv");
const firestore = require("../firebase-config");
const ajv = new Ajv();

exports.isValid = (schemaValidator, data) => {
  return ajv.validate(schemaValidator, data);
};

exports.docExist = async (collection, id) => {
  const doc = await firestore.collection(collection).doc(id).get();
  if (!doc.exists) return false;
  return doc;
};
