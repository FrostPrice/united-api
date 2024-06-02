const { prisma } = require("../config.js");
const response = require("../utils/response.js");

exports.get = (req, res) => {
  prisma.grade
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.grade
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
  const { assessmentId, enrollmentId, value } = req.body;

  if (!assessmentId || !enrollmentId || !value) {
    return response(res, 400, "All Fields are required", "");
  }

  const grade = {
    assessmentId,
    enrollmentId,
    value,
  };

  prisma.grade
    .create({ data: grade })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  const { assessmentId, enrollmentId, value } = req.body;

  const grade = {
    assessmentId,
    enrollmentId,
    value,
  };

  prisma.grade
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: grade,
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.grade
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
