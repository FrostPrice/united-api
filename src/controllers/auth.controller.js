const { prisma } = require("../config.js");
const response = require("../utils/response.js");
const bcrypt = require("bcryptjs");
/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
exports.checkSession = (req, res) => {
  if (req.session.userId) {
    return response(res, 200, "Session found", "");
  } else {
    return response(res, 403, "No session found", "");
  }
};
exports.login = (req, res) => {
  console.log(req.body);
  // Determine if the username is an email or an id based on its content
  const isEmail = req.body.username.includes("@");

  prisma.user
    .findFirst({
      where: {
        OR: [
          { email: isEmail ? req.body.username : undefined },
          { id: !isEmail ? req.body.username : undefined },
        ],
      },
    })
    .then((user) => {
      if (!user) {
        return response(res, 404, "User not found", "");
      }

      // Check if the provided password matches the user's hashed password
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return response(res, 401, "Invalid password", "");
      }

      // Store user info in session
      req.session.userId = user.id; // Storing user ID in session
      req.session.isAuthenticated = true; // Additional flag to track authentication status

      // Success response, no token needed
      return response(res, 200, "Login successful", { userId: user.id });
    })
    .catch((error) => {
      console.error("Error authenticating user:", error);
      return response(res, 500, "Internal server error", "");
    });
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return response(res, 500, "Failed to log out", "");
    }
    res.clearCookie("connect.sid"); // Adjust this depending on your session cookie name!
    return response(res, 200, "Logout successful", "");
  });
};
