const User = require('../models/sequelize').User;
const Token = require('../models/sequelize').Token;

const authenticate = (req, res, next) => {
  var tokenHash = req.header('authToken');

  Token.findOne({ where: { tokenHash } }).then(token => {
    return token.getUser()
  }).then(user => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = tokenHash;
    next();
  }).catch(() => {
    req.user = null;
    next();
  })

}

module.exports = { authenticate };