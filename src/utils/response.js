module.exports = (res, httpCode, msg = "", data) => {
  res.status(httpCode).send({ msg: msg, data: data });
};
