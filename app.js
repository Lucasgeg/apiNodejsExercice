const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
dotenv.config();
const db = require("./firebase-config");
const Ajv = require("ajv");
const ajv = new Ajv();
const usersSchema = require("./schemas/user");

const app = express();
const PORT = process.env.PORT || 8080;

const isValid = (schemaValidator, data) => {
  return ajv.validate(schemaValidator, data) ? true : false;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

require("./routes/auth")(app);

app.post("/create", async (req, res) => {
  console.log("user data :", req.body);
  await db.collection("Users").add(req.body);
  res.status(200).json({ message: "user created" });
});

app.listen(PORT, () => {
  console.log("server listen on port " + PORT);
});
