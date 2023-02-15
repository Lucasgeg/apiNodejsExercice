const fireStore = require("../firebase-config");

const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const { isValid } = require("../utils/basics");

const userSchema = require("../schemas/user");

const userAllreadyExist = async (email) => {
  const user = await fireStore.collection("Users").where("email", "==", email);

  const userData = (await user.get()).docs[0];

  return Boolean(userData);
};

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: 60 * 30,
  });
};

const generateRefreshToken = (data) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  });
};

exports.register = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Service to register a new user for the menu API';
  // #swagger.summary = "Service to register a new user";
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
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Service to login a user into menuAPI';
  // #swagger.summary = "Service to log a  user";
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
        const refreshJwt = generateRefreshToken({
          email: userData.email,
          firstName: userData.firstName,
          id: userData.id,
          admin: userData.admin,
        });
        const jwt = generateAccessToken({
          email: userData.email,
          firstName: userData.firstName,
          id: userData.id,
          admin: userData.admin,
        });
        res.cookie("jwt", jwt, {
          httpOnly: true,
        });
        res.cookie("refresh_token", refreshJwt, {
          httpOnly: true,
        });
        return res.status(200).send({
          message: "you are connected!",
          id: userData.id,
          jwt,
          refreshToken: generateRefreshToken({
            email: userData.email,
            firstName: userData.firstName,
            id: userData.id,
            admin: userData.admin,
          }),
        });
      }
      return res.status(403).send({ error: "Invalid password or email :'(" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "what's happening here!" });
    }
  });
};
exports.me = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Service to get information about current  user';
  // #swagger.summary = "Service tto get information";
  const user = req.user;

  if (user.admin) return res.status(200).send({ message: "admin you are" });
  else
    return res.status(200).send({
      message:
        "Hey friend! you're not an admin but you can do some request ;-)",
    });
};
