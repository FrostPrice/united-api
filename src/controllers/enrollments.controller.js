const { prisma } = require("../config.js");
const response = require("../utils/response.js");

exports.get = (req, res) => {
  prisma.enrollment
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.enrollment
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
  const { userId, subjectId, status, absences, maxAbsences } = req.body;

  if (!userId || !subjectId || !status || isNaN(absences) || !maxAbsences) {
    return response(res, 400, "All Fields are required", "");
  }

  const enrollment = {
    userId,
    subjectId,
    status,
    absences,
    maxAbsences,
  };

  prisma.enrollment
    .create({ data: enrollment })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  const { userId, subjectId, status, absences, maxAbsences } = req.body;

  if (!userId || !subjectId || !status || !absences || !maxAbsences) {
    return response(res, 400, "All Fields are required", "");
  }

  const enrollment = {
    userId,
    subjectId,
    status,
    absences,
    maxAbsences,
  };

  prisma.enrollment
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: enrollment,
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.enrollment
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
