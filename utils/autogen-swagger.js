const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const userSchema = require("../schemas/user");
const menusSchema = require("../schemas/menus");

const outputFile = "schemas/swagger.json";
const endpoints = ["routes/auth.js", "routes/menus.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Menus API documentation",
    description: "Documentation of MenusAPI",
    termsOfService: "http://swagger.io/terms/",
    contact: {
      email: "contact@toto.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost:8081/menusapi/api/v1/",
    },
  ],
  host: "localhost:8081/menusapi/api/v1",
  basePath: "/",
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  "@definitions": {
    AddUser: userSchema,
    AddMenus: menusSchema,
  },
};

swaggerAutogen(outputFile, endpoints, doc).then(() => {
  require("../app");
});
