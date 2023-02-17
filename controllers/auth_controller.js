const fireStore = require("../firebase-config");

const bcrypt = require("bcrypt");
const salt = 10;
const jwt = require("jsonwebtoken");
const { isValid, formatData } = require("../utils/basics");

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
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Service to register a new user for the menu API';
     #swagger.summary = "Service to register a new user";
     #swagger.responses[200] = {
                  description: 'Registration is succesfull',
                  schema: {
      "message": "Successfully added! You can now connect to your account",
      "Informations": {
          "datas": "object with user information formatted"
      }
     }
    } 
     #swagger.responses[403] = {
                  description: 'Registration is impossible',
                  schema: {
      "message1": "Invalid or insufficient data for registration",
      "message2": "User allready exist"
     }
    } 
     #swagger.responses[500] = {
                  description: 'Server Error',
                  schema: {
      "message": "Internal server error",
     }
    } 
     #swagger.parameters['obj'] = {
          in: 'body',
          description: 'user Signin information',
          schema: { $ref: "#/definitions/AddUser" }
     }
    } 
    */
  const data = req.body;
  if (!isValid(userSchema, req.body))
    return res
      .status(403)
      .send({ message: "Invalid or insufficient data for registration" });
  if (await userAllreadyExist(req.body.email))
    return res.status(403).send({ message: "User allready exist" });

  return bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
    fireStore
      .collection("Users")
      .add({
        ...formatData(data),
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
};
exports.login = async (req, res) => {
  /* #swagger.tags = ['Auth']
   #swagger.description = 'Service to login';
   #swagger.summary = "Service to login a user to the app";
   #swagger.responses[200] = {
                description: 'Login sucess',
                schema: {
    "message": "Successfully connected!",
    "jwt": "A very long token",
    "refresh_jwt": "An other long token"
   }
  } 
   #swagger.responses[404] = {
                description: 'Login fail',
                schema: {
                  "message": "User or password incorrect"
   }
  } 
   #swagger.responses[500] = {
                description: 'Server Error',
                schema: {
    "message": "Internal server error",
   }
  } 
   #swagger.parameters['obj'] = {
        in: 'body',
        description: 'user Signin information',
          schema: { $ref: "#/definitions/Login" }
   }
  } 
  */
  const { email, password } = await req.body;
  const user = fireStore.collection("Users").where("email", "==", email);

  const userExist = (await user.get()).docs[0];

  if (!userExist)
    return res.status(404).send({ error: "Invalid password or email :'(" });

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
        return res.status(200).send({
          message: "you are connected!",
          id: userData.id,
          jwt,
          refreshJwt,
        });
      }
      return res.status(404).send({ error: "Invalid password or email :'(" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "what's happening here!" });
    }
  });
};
exports.me = (req, res) => {
  /* #swagger.tags = ['Auth']
   #swagger.description = 'Please put the bearer token on the top of the request, not on the authorization input field';
   #swagger.summary = "Service to know if user is an administrator";
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.responses[200] = {
                description: 'Token is valid',
                schema: {
        "message1": "Admin you are",
        "message2": "Hey friend! you're not an admin but you can do some request ;-)"
   }
  } 
  #swagger.responses[401] = {
                description: 'Unauthorized',
                schema: {
    "error": "Your rights are revoked."
}
  } 
 */
  const user = req.user;

  if (user.admin) return res.status(200).send({ message: "admin you are" });
  else
    return res.status(200).send({
      message:
        "Hey friend! you're not an admin but you can do some request ;-)",
    });
};
