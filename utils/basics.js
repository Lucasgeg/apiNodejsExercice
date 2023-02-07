const Ajv = require("ajv");
const ajv = new Ajv();

exports.isValid = (schemaValidator, data) => {
  return ajv.validate(schemaValidator, data);
};
