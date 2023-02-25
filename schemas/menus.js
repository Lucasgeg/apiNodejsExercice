exports.menusSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The unique uid of the menu",
      default: "Axfdsf451dqDs",
      maxLength: 20,
    },
    starter: {
      type: "string",
      description: "The starter of the menu",
      default: "Salade de thon",
      maxLength: 35,
    },
    main: {
      type: "string",
      description: "main dish",
      default: "Tartare de boeuf bien cuit",
      maxLength: 35,
    },
    dessert: {
      type: "string",
      description: "The dessert",
      default: "Soupe à l'oignon",
      maxLength: 35,
    },
    price: {
      type: "number",
      description: "The price of the menu",
      default: 75.5,
    },
  },
  required: ["starter", "main", "dessert", "price"],
};

exports.updateMenuSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      default: "Axfdsf451dqDs",
      description: "The unique uid of the menu",
    },
    starter: {
      type: "string",
      description: "The starter of the menu",
      default: "Salade de thon",
      maxLength: 15,
    },
    main: {
      type: "string",
      description: "main dish",
      default: "Tartare de boeuf bien cuit",
      maxLength: 15,
    },
    dessert: {
      type: "string",
      description: "The dessert",
      default: "Soupe à l'oignon",
      maxLength: 15,
    },
    price: {
      type: "number",
      description: "The price of the menu",
      default: 75.5,
    },
  },
  required: ["id"],
};
