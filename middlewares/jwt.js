const jwt = require("jsonwebtoken");

exports.authenticateToken = (headers) => {
  const token = headers && headers.split(" ")[1]; // 'Bearer {token}'

  if (!token) {
    res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
};
