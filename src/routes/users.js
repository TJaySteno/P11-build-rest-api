'use strict';

const router = require('express').Router();

const { User } = require('../models/user');
const authenticate = require('../middleware/authenticate');

// GET /api/users 200
  // Returns the currently authenticated user
router.get('/', authenticate, (req, res, next) => res.json(req.user));

// POST /api/users 201
  // Creates a user, sets the Location header to "/", and returns no content
router.post('/', async (req, res, next) => {
  const user = new User(req.body);
  user.save(saveErr => {
    if (saveErr) {
      saveErr.status = 400;
      return next(saveErr);
    }
    res.status(201);
    res.location('/');
    res.send();
  });
});

module.exports = router;

/*
EC:
  Tests have been written for the following user story:
    When I make a request to the GET /api/users route with the correct credentials, the corresponding user document is returned
    When I make a request to the GET /api/users route with invalid credentials, a 401 status saveError is returned
*/
