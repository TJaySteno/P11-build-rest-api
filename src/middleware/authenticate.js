const auth = require('basic-auth');

const { User } = require('../models/user');
const err = require('./err');

const authenticate = (req, res, next) => {
  const cred = auth(req);
  const noCredentials = (!cred || !cred.name || !cred.pass);
  if (noCredentials) return next(err(401, 'You are not authorized for this content'));
  User.authenticate(cred, req, next, err);
};

module.exports = authenticate;
