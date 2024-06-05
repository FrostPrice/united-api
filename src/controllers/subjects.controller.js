const { prisma } = require("../config.js");
const response = require("../utils/response.js");

exports.get = (req, res) => {
  prisma.subject
    .findMany({
      include: { Professor: true },
    })
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.subject
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        Professor: true,
        Content: true,
        Assessment: true,
        Enrollment: true,
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
  const {
    name,
    courseId,
    professorId,
    period,
    yearSemester,
    status,
    lastNotification,
  } = req.body;

  if (
    !name ||
    !courseId ||
    !professorId ||
    !period ||
    !yearSemester ||
    !status
  ) {
    return response(res, 400, "All Fields are required", "");
  }

  const subject = {
    name,
    courseId,
    professorId,
    period,
    yearSemester,
    status,
    lastNotification,
  };

  prisma.subject
    .create({ data: subject })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  const {
    name,
    courseId,
    professorId,
    period,
    yearSemester,
    status,
    lastNotification,
  } = req.body;

  if (
    !name ||
    !courseId ||
    !professorId ||
    !period ||
    !yearSemester ||
    !status
  ) {
    return response(res, 400, "All Fields are required", "");
  }

  const subject = {
    name,
    courseId,
    professorId,
    period,
    yearSemester,
    status,
    lastNotification,
  };

  prisma.subject
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: subject,
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.subject
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
