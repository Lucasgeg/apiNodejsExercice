const Ajv = require("ajv");
const ajv = new Ajv();
const fireStore = require("../firebase-config");
const jwt = require("jsonwebtoken");

exports.isValid = (schemaValidator, data) => {
  return ajv.validate(schemaValidator, data);
};

exports.docExist = async (collection, id) => {
  const doc = await fireStore.collection(collection).doc(id).get();
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

exports.userAlreadyExists = async (email) => {
  const user = await fireStore.collection("Users").where("email", "==", email);

  const userData = (await user.get()).docs[0];

  return Boolean(userData);
};

exports.generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: 60 * 30,
  });
};

exports.generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
};
