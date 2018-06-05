'use strict';

const router = require('express').Router();

const { Course } = require('../models/course');
const { User } = require('../models/user');
const { Review } = require('../models/review');
const authenticate = require('../middleware/authenticate');
const err = require('../middleware/err');

// Use 'courseID' param to look up course
router.param('courseID', (req, res, next, id) => {
  Course.findById(id, async (findErr, course) => {
    if (findErr) return next(findErr);
    if (!course) return next(err(404, 'Course not found'));

    const thisCourse = course;
    thisCourse.user = await User.findById(course.user, '_id fullName', (err, user) => err ? next(err) : user);
    Review.find()
      .where('_id').in(course.reviews)
      .exec((err, reviews) => {
        if (err) return next(err);
        thisCourse.reviews = reviews;
        req.course = thisCourse;
        next();
      });
  });
});

// GET /api/courses 200
  // Returns the '_id' and 'title' props for all courses, sorted alphabetically by title
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({}, '_id title').sort({ title: 1 });
    res.json(courses);
  } catch (findErr) {
    next(findErr);
  }
});

// POST /api/courses 201
  // Creates a course, sets the Location header, and returns no content
router.post('/', authenticate, (req, res, next) => {
  const course = new Course(req.body);
  course.save(saveErr => {
    if (saveErr) {
      saveErr.status = 400;
      return next(saveErr);
    }

    res.status(201);
    res.location('/');
    res.send();
  });
});

// GET /api/courses/:courseId 200
  // Returns all Course properties and related user and review documents for the provided course ID
router.get('/:courseID', (req, res) => {



  /*
  EC:
    for user and reviews.user props
      only user id and fullName are returned

  full text: Using deep population, only the user’s id and fullName are returned for the user and reviews.user properties on the GET /api/courses/:courseId route
  */

  res.json(req.course);
});

// PUT /api/courses/:courseId 204
  // Updates a course and returns no content
router.put('/:courseID', authenticate, (req, res, next) => {
  req.course.update(req.body).exec()
    .then(() => {
      // NOTE: should this be creating a new course?
      res.status(204);
      res.send();
    })
    .catch(updateErr => next(updateErr));
});

// POST /api/courses/:courseId/reviews 201
  // Creates a new review for a course, sets the Location header, and returns no content
router.post('/:courseID/reviews', authenticate, (req, res, next) => {
  const reviewTemplate = req.body;
  reviewTemplate.user = req.user._id;
  const review = new Review(reviewTemplate);

  Course.findById(req.course._id)
    .exec((findErr, course) => {
      course.reviews.push(review);
      course.save(saveErr => saveErr ? next(saveErr) : null );

      res.status(201);
      res.location('/');
      res.send();
    });
});

module.exports = router;
