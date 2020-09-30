const logger = require("./logger").system;

module.exports = (options) => (err, req, res, next) => {
    console.log('errorです。：' + err.message);
  logger.error(err.message);
  next(err);
}