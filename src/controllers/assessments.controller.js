const { prisma } = require("../config.js");
const response = require("../utils/response.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.get = (req, res) => {
  prisma.assessment
    .findMany()
    .then((data) => {
      response(res, 200, "Ok", data);
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.findById = (req, res) => {
  prisma.assessment
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
  const { name, subjectId, dueDate, status } = req.body;

  if (!name || !subjectId || !dueDate || !status) {
    return response(res, 400, "All Fields are required", "");
  }

  prisma.assessment
    .create({ data: req.body })
    .then(() => {
      response(res, 201, "Created", "");
    })
    .catch((err) => {
      response(res, 500, "Internal Server Error", err);
    });
};

exports.put = (req, res) => {
  prisma.assessment
    .update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    })
    .then(() => {
      response(res, 200, "Ok", "");
    })
    .catch((err) => {
      response(res, 404, "Not Found", err);
    });
};

exports.delete = (req, res) => {
  prisma.assessment
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

exports.uploadFile = (req, res) => {
  const assessmentId = req.params.id;

  // Check if the assessment exists
  prisma.assessment
    .findUnique({
      where: {
        id: parseInt(assessmentId),
      },
    })
    .catch((err) => {
      return response(res, 404, "Not Found", err);
    });

  upload.single("file")(req, res, (err) => {
    if (err) {
      return response(res, 500, "File upload failed", err);
    }

    // Save the file path in the database if necessary
    const filePath = req.file.path;

    prisma.assessment
      .update({
        where: {
          id: parseInt(assessmentId),
        },
        data: {
          filePath,
        },
      })
      .then(() => {
        return response(res, 200, "File uploaded successfully", filePath);
      })
      .catch((err) => {
        return response(res, 500, "Internal Server Error", err);
      });
  });
};
