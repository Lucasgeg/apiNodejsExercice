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

exports.formatData = (datas) => {
  const formattedData = {};
  for (const [key, value] of Object.entries(datas)) {
    typeof value === "string"
      ? (formattedData[key] = value.toLowerCase().trim())
      : (formattedData[key] = value);
  }
  return formattedData;
};
