const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(401).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
             });
};

verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided!",
    });
  }

  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({
      message: "Invalid token format!",
    });
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized!",
      });
    }

    req.key = decoded.key;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};

isGuest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "guest") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Guest Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Guest role!",
    });
  }
};

isGuestOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "guest") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Guest or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Guest or Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  verify,
  isAdmin,
  isGuest,
  isGuestOrAdmin,
};
module.exports = authJwt;
