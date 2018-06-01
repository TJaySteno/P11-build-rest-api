'use strict';

const router = require('express').Router();
const { Course } = require('../models/course');

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ title: 1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

router.get('/:cID', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.cID);
    res.json(course);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
