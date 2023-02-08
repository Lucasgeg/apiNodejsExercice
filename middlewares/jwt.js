const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // 'Bearer {token}'

  if (!token) {
    res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ error: "Your rights are revoked." });
    }
    req.user = user;
    next();
  });
};

exports.isAuthorize = (req, res, next) => {
  try {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]; // 'Bearer {token}'

    if (!token) {
      res.sendStatus(401);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({ error: "Your rights are revoked." });
      }
      if (!user.admin)
        return res.status(401).send({ error: "You're not an admin" });
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Oh no no no!");
  }
};
