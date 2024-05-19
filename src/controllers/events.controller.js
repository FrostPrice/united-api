const { prisma } = require("../config.js");
const response = require("../utils/response.js");

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
exports.get = (req, res) => {
  prisma.event
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.event
    .findUnique({
      where: {
        id: parseInt(req.params.id),
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
  const { title, description, date_begin, date_end } = req.body;

  // Validate input
  if (!title || !description || !date_begin || !date_end) {
    return response(res, 400, "All Fields are required", "");
  }

  const event = {
    title,
    description,
    date_begin: new Date(date_begin),
    date_end: new Date(date_end),
    userId: req.session.userId,
  };
  prisma.event
    .create({ data: event })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  prisma.event
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
  prisma.event
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
