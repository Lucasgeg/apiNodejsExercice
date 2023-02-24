const fireStore = require("../firebase-config");

const bcrypt = require("bcrypt");
const salt = 10;
const {
  isValid,
  formatData,
  generateAccessToken,
  generateRefreshToken,
  userAlreadyExists,
} = require("../utils/basics");
const { userRegistrationSchema } = require("../schemas/user");
const { ERROR_MESSAGES, COLLECTIONS } = require("../utils/enum");

exports.register = async (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.description = 'Service to register a new user for the menu API No authorization needed';
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
  const { email, password } = data;
  if (!(await isValid(userRegistrationSchema, data)))
    return res
      .status(403)
      .send({ message: "Invalid or insufficient data for registration" });

  if (await userAlreadyExists(email))
    return res.status(403).send({ message: "User allready exist" });

  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const userRef = await fireStore.collection(COLLECTIONS.USERS).add({
      ...formatData(data),
      password: hashPassword,
    });

    await userRef.update({
      id: userRef.id,
    });

    return res.status(200).send({
      message: "Successfully added! You can now connect to your account",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
exports.login = async (req, res) => {
  /* #swagger.tags = ['Auth']
   #swagger.description = 'Service to login';
   #swagger.summary = "Service to login a user to the app No authorization needed";
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
          description: 'user login information',
          schema: { $ref: "#/definitions/Login" }
     }
  } 
  */
  const { email, password } = await req.body;
  const user = fireStore.collection("Users").where("email", "==", email);
  const errorMessage = "Invalid password or email :'(";
  const userExist = (await user.get()).docs[0];

  if (!userExist) return res.status(404).send({ error: errorMessage });

  const userData = userExist.data();
  console.log(userData);
  try {
    const correct = await bcrypt.compare(password, userData.password);

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
        jwt: `bearer ${jwt}`,
        refreshJwt,
      });
    }

    return res.status(404).send({ error: errorMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "what's happening here!" });
  }
};
exports.me = (req, res) => {
  /* #swagger.tags = ['Auth']
   #swagger.description = 'Please put the bearer token on the top of the request, not on the authorization input field';
   #swagger.summary = "Service to know if user is an administrator Authorization needed admin=false/true";
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
  if (!user) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (user.admin) return res.status(200).send({ message: "admin you are" });
  else
    return res.status(200).send({
      message:
        "Hey friend! you're not an admin but you can do some request ;-)",
    });
};
