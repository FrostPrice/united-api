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
        id: req.params.id, // Ensure the id is an integer if it's expected to be one
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

exports.put = (req, res) => {
  prisma.notification
    .update({
      where: {
        id: req.params.id,
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
