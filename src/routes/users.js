'use strict';

const router       = require('express').Router();

const { User }     = require('../models/user');
const authenticate = require('../middleware/authenticate');
const respond      = require('../middleware/respond');
const error        = require('../middleware/error');

/* GET /api/users 200
    Returns the currently authenticated user */
router.get('/', authenticate, (req, res) => res.json(req.user));

/* POST /api/users 201
    Creates a user, sets the Location header to "/", and returns no content */
router.post('/', async (req, res, next) => {
  const user = new User(req.body);
  user.save(err => {
    if (err) return next(error(400, err));
    res.send(respond(201, res, '/'));
  });
});

module.exports = router;
