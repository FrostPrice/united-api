const { prisma } = require("../config.js");
const response = require("../utils/response.js");

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
exports.get = (req, res) => {
  prisma.notification
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.notification
    .findUnique({
      where: {
        id: parseInt(req.params.id), // Ensure the id is an integer if it's expected to be one
      },
    })
    .then((data) => {
      if (data) {
        response(res, 200, "Ok", data);
      } else {
        response(res, 404, "Not Found", "");
      }
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", { error: err });
    });
};

exports.post = (req, res) => {
  const { title, description, status, type } = req.body;

  // Validate input
  if (!title || !description || !date) {
    return response(res, 400, "All Fields are required", "");
  }

  const notification = {
    title,
    description,
    status,
    type,
    userId: req.session.userId,
  };
  prisma.notification
    .create({ data: notification })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  prisma.notification
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.notification
    .delete({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};
