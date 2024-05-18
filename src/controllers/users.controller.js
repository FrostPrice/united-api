const { prisma } = require("../config.js");
const response = require("../utils/response.js");

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
exports.get = (req, res) => {
  prisma.user
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  // TODO: This logic could become a middleware
  if (req.session.role !== "admin" && req.session.userId !== req.params.id) {
    return response(res, 403, "Permission Denied", "");
  }

  prisma.user
    .findUnique({
      where: {
        id: req.params.id,
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
  prisma.user
    .update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        telephone1: req.body.telephone1,
        telephone2: req.body.telephone2,
        // profile_img: req.body.profile_img, // TODO: Implement image upload
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
  prisma.user
    .delete({
      where: {
        id: req.params.id,
      },
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};
