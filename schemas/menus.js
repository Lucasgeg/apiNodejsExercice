exports.menusSchema = {
  type: "object",
  properties: {
    id: { type: "string", default: "Axfdsf451dqDs" },
    starter: { type: "string", default: "Salade de thon" },
    main: { type: "string", default: "Tartare de boeuf bien cuit" },
    dessert: { type: "string", default: "Soupe à l'oignon" },
    price: { type: "number", default: 75.5 },
  },
  required: ["starter", "main", "dessert", "price"],
};

exports.updateMenuSchema = {
  type: "object",
  properties: {
    id: { type: "string", default: "Axfdsf451dqDs" },
    starter: { type: "string", default: "Salade de thon" },
    main: { type: "string", default: "Tartare de boeuf bien cuit" },
    dessert: { type: "string", default: "Soupe à l'oignon" },
    price: { type: "number", default: 75.5 },
  },
  required: ["id"],
};
