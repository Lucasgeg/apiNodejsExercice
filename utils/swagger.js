const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: `3.0.0`,
    info: {
      title: "LogRocket Express API with Swagger",
      version: "3.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/menusapi/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

exports.specs = swaggerJsdoc(options);
