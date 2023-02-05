const fireStore = require("../firebase-config");

const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/user");
const Ajv = require("ajv");
const { authenticateToken } = require("../middlewares/jwt");
const ajv = new Ajv();

const userAllreadyExist = async (email) => {
  const user = await fireStore.collection("Users").where("email", "==", email);

  const userData = (await user.get()).docs[0];

  return userData ? true : false;
};

const isValid = (schemaValidator, data) => {
  return ajv.validate(schemaValidator, data);
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: 60 * 5,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1 month",
  });
};

exports.register = async (req, res) => {
  const data = req.body;
  if (!isValid(userSchema, req.body))
    return res.status(403).send({ message: "invalid" });
  if (await userAllreadyExist(req.body.email))
    return res.status(403).send({ message: "user allready exist" });

  bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
    fireStore
      .collection("Users")
      .add({
        ...data,
        password: hashPassword,
      })
      .then((docRef) => {
        console.log("docRef:", docRef.id);
        fireStore.collection("Users").doc(docRef.id).update({
          id: docRef.id,
        });
        return res.status(200).send({
          message: "Successfully added! You can now connect to your account",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "what's happening?" });
      });
  });
  return;
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = fireStore.collection("Users").where("email", "==", email);

  const userExist = (await user.get()).docs[0];

  if (!userExist)
    return res.status(403).send({ error: "Invalid password or email :'(" });

  const userData = userExist.data();
  console.log(userData);
  bcrypt.compare(password, userData.password, (err, correct) => {
    try {
      if (correct) {
        const jwt = generateAccessToken({
          email: userData.email,
          firstName: userData.firstName,
          id: userData.id,
        });
        return res.status(200).send({
          message: "you are connected!",
          id: userData.id,
          jwt,
        });
      }
      return res.status(403).send({ error: "Invalid password or email :'(" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "what's happening here!" });
    }
  });
};
exports.me = async (req, res) => {
  const authHeader = req.headers && req.headers["authorization"];
  const token = authenticateToken(authHeader);
  return res.send(req.user);
  // todo: check the token
  // todo: extract token
  // todo: decode token
  // todo: return user data without password
};
