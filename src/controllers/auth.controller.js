const { prisma } = require("../config.js");
const response = require("../utils/response.js");
const bcrypt = require("bcryptjs");

const validateCPF = (cpf) => {
  const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

  return cpfRegex.test(cpf);
};

const validateEmail = (email) => {
  const validateEmail = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;

  return validateEmail.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

  return phoneRegex.test(phone);
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
exports.checkSession = (req, res) => {
  if (req.session.userId) {
    return response(res, 200, "Session found", { userId: req.session.userId });
  } else {
    return response(res, 403, "No session found", "");
  }
};

exports.login = (req, res) => {
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

      req.session.regenerate(function (err) {
        if (err) return response(res, 500, "Session Error", err);

        // Store user info in session
        req.session.userId = user.id; // Storing user ID in session
        req.session.isAuthenticated = true; // Additional flag to track authentication status
        req.session.role = user.role; // Store user role in session

        req.session.save(function (err) {
          if (err) return response(res, 500, "Session Error", err);

          // Success response, no token needed
          return response(res, 200, "Login successful", { userId: user.id });
        });
      });
    })
    .catch((error) => {
      return response(res, 500, "Internal server error", "");
    });
};
exports.logout = (req, res) => {
  // Check if session exists
  if (!req.session.userId) {
    return response(res, 403, "No session found", "");
  }

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      return response(res, 500, "Failed to log out", "");
    }
    res.clearCookie("connect.sid"); // Adjust this depending on your session cookie name!
    return response(res, 200, "Logout successful", "");
  });
};

exports.register = async (req, res) => {
  const {
    cpf,
    email,
    name,
    password,
    role,
    profile_img,
    telephone1,
    telephone2,
    status,
    course,
    currentPeriod,
    totalPeriods,
  } = req.body;

  if (
    !cpf ||
    !email ||
    !name ||
    !password ||
    !telephone1 ||
    !status ||
    !course ||
    !currentPeriod ||
    !totalPeriods
  ) {
    return response(res, 400, "All required fields must be filled", "");
  }

  if (!validateCPF(req.body.cpf)) {
    return response(res, 400, "Invalid CPF", "");
  }

  if (!validateEmail(req.body.email)) {
    return response(res, 400, "Invalid Email", "");
  }

  if (!validatePhoneNumber(req.body.telephone1)) {
    return response(res, 400, "Invalid Phone Number 1", "");
  }

  if (!validatePhoneNumber(req.body.telephone2)) {
    return response(res, 400, "Invalid Phone Number 2", "");
  }

  try {
    // Check if user already exists by CPF or email
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ id: cpf }, { email: email }],
      },
    });

    if (userExists) {
      return response(
        res,
        409,
        "User already exists with this CPF or email",
        ""
      );
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: cpf,
        email: email,
        name: name,
        password: hashedPassword,
        role: role || "student", // default role
        profile_img: profile_img,
        telephone1: telephone1,
        telephone2: telephone2,
        status: status,
        course: course,
        currentPeriod: currentPeriod,
        totalPeriods: totalPeriods,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Success response
    return response(res, 201, "User registered successfully", {
      userId: user.id,
    });
  } catch (error) {
    return response(res, 500, "Internal server error", "");
  }
};
