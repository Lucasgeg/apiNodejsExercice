exports.userRegistrationSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "name of the user",
      default: "John Doe",
      maxLength: 10,
    },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
      description: "email of the user",
      default: "toto@gmail.com",
      maxLength: 20,
    },
    password: {
      type: "string",
      description: "password of the user",
      pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
      default: "fsdfsd2+65ffds",
      maxLength: 20,
    },
    pseudo: {
      type: "string",
      description: "The user pseudo",
      default: "DilidoMaster",
      maxLength: 15,
    },
    admin: {
      type: "boolean",
      description: "set if user is an admin or not",
      default: true,
    },
  },
  required: ["name", "email", "password", "admin"],
};
exports.loginSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
      description: "email of the user",
      default: "illbeagodness@gmail.com",
    },
    password: {
      type: "string",
      description: "password of the user",
      pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
      default: "toto123%%reat",
    },
  },
  required: ["email", "password"],
};
