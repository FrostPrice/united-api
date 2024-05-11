const response = require("../utils/response.js");

exports.get = (req, res) => {
  response(res, 200, "Ok", "API is working!");
};
