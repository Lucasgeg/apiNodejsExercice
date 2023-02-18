const dotenv = require("dotenv"),
  express = require("express"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  swaggerUi = require("swagger-ui-express"),
  swaggerFile = require("./schemas/swagger.json");
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

const options = {
  explorer: true,
  swaggerOptions: {
    docExpansion: "none",
    persistAuthorization: true,
  },
  customCssUrl:
    "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-outline.css",
};
// require("./utils/swagger")
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

app.listen(port, () => {
  process.env.ENVIRONMENT === "development"
    ? console.log("check the url http://localhost:" + port + "/api-docs")
    : console.log("listen on port:" + port);
});
