const menusSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    starter: { type: "string" },
    main: { type: "string" },
    dessert: { type: "string" },
    price: { type: "number" },
  },
  required: ["starter", "main", "dessert", "price"],
};

module.exports = menusSchema;
