const userSchema = {
  registration: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "name of the user",
        default: "John Doe",
      },
      email: {
        type: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
        description: "email of the user",
        default: "toto@gmail.com",
      },
      password: {
        type: "string",
        description: "password of the user",
        pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
        default: "fsdfsd2+65ffds",
      },
      pseudo: {
        type: "string",
        description: "The user pseudo",
        default: "DilidoMaster",
      },
      admin: {
        type: "boolean",
        description: "set if user is an admin or not",
        default: true,
      },
    },
    required: ["name", "email", "password", "admin"],
  },
  login: {
    type: "object",
    properties: {
      email: {
        type: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
        description: "email of the user",
        default: "totiu@gmail.com",
      },
      password: {
        type: "string",
        description: "password of the user",
        pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
        default: "toto123%%reat",
      },
    },
    required: ["email", "password"],
  },
};

module.exports = userSchema;
