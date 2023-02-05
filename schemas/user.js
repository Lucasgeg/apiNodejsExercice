const userSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: {
      type: "string",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$",
    },
    pseudo: { type: "string" },
  },
  required: ["name", "email", "password"],
};

module.exports = userSchema;
