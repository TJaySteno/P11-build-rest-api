'use strict';

const auth     = require('basic-auth');

const { User } = require('../models/user');
const error    = require('./error');

/* Parse authentication headers, then test them against our records */
const authenticate = (req, res, next) => {
  const cred = auth(req);
  const hasCredentials = (cred && cred.name && cred.pass);
  if (hasCredentials) User.authenticate(cred, req, next, error);
  else next(error(401, 'You are not authorized for this content'));
};

module.exports = authenticate;
