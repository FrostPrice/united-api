const { prisma } = require("../config.js");
const response = require("../utils/response.js");

exports.get = (req, res) => {
  prisma.course
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.course
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
  const { name, professorId } = req.body;

  if (!name || !professorId) {
    return response(res, 400, "All Fields are required", "");
  }

  const course = {
    name,
    professorId,
  };

  prisma.course
    .create({ data: course })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  const { name, professorId } = req.body;

  if (!name || !professorId) {
    return response(res, 400, "All Fields are required", "");
  }

  const course = {
    name,
    professorId,
  };

  prisma.course
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: course,
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.course
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
