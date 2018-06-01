'use strict';

const router = require('express').Router();
const User = require('../models/user').User;

// GET all users and display alphabetically
router.get('/', async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401);
      return res.json('You must be authorized to view this page.');
    }
    const users = await User.find({}).sort({ fullName: 1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    User.create(req.body, (err, user) => {
      if (err) {
        res.status(400);
        if (err.code === 11000) {
          return res.json(`Please provide a different email address, this one is already being used.`);
        } else if (err.errors) {
          let json = { 'message': 'Please provide all required information.'};
          for (let error in err.errors) {
            json[error] = `${err.errors[error].message}`;
          }
          return res.json(json);
        } else return res.json(err)
      }
      console.log('User saved!');
      res.redirect('/api/users');
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
