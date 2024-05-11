const { prisma } = require("../config.js");
const response = require("../utils/response.js");

const checkSession = (req, res, next) => {
  if (req.session.userId) {
    next(); // Session is active, user is logged in, proceed to next middleware
  } else {
    return response(res, 403, "No session found", "");
  }
};

const isAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return response(res, 403, "No session found", "");
  }

  prisma.user
    .findUnique({
      where: {
        id: req.session.userId,
      },
    })
    .then((user) => {
      if (!user) {
        return response(res, 404, "User not found", "");
      }

      if (user.role === "admin") {
        next();
      } else {
        return response(res, 403, "Require Admin Role!", "");
      }
    })
    .catch((err) => {
      console.error("Error checking admin role:", err);
      return response(res, 500, "Internal server error", "");
    });
};

module.exports = { checkSession, isAdmin };

// TODO: Check if the login is working correctly
