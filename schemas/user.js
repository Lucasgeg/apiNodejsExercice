const userSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "name of the user",
      example: "John Doe",
    },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
      description: "email of the user",
      example: "toto@gmail.com",
    },
    password: {
      type: "string",
      description: "password of the user",
      pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
      example: "fsdfsd2+65ffds",
    },
    pseudo: {
      type: "string",
      description: "The user pseudo",
      example: "DilidoMaster",
    },
    admin: {
      type: "boolean",
      description: "set if user is an admin or not",
      example: true,
    },
  },
  required: ["name", "email", "password", "admin"],
};

module.exports = userSchema;
