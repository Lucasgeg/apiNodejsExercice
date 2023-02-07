const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv.config();
const db = require("./firebase-config");
const Ajv = require("ajv");
const ajv = new Ajv();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

// default routes for register/login/me
require("./routes/auth")(app);

// routes for get/post/update/delete menus
require("./routes/menus")(app);

app.listen(PORT, () => {
  console.log("server listen on port " + PORT);
});
