'use strict';

const router       = require('express').Router();

const { Course }   = require('../models/course');
const { User }     = require('../models/user');
const { Review }   = require('../models/review');
const authenticate = require('../middleware/authenticate');
const respond      = require('../middleware/respond');
const error        = require('../middleware/error');

// Use 'courseID' param to look up course
router.param('courseID', (req, res, next, id) => {
  Course.findById(id, (err, course) => {
    if (err) return next(err);
    if (!course) return next(error(404, 'Course not found'));
    req.course = course;
    next();
  });
});

// GET /api/courses 200
  // Returns the '_id' and 'title' props for all courses, sorted alphabetically by title
router.get('/', async (req, res, next) => {
  Course.find({}, '_id title').sort({ title: 1 })
    .then(courses => res.json(courses))
    .catch(err => next(err));
});

// POST /api/courses 201
  // Creates a course, sets the Location header, and returns no content
router.post('/', authenticate, (req, res, next) => {
  const course = new Course(req.body);
  course.save(err => {
    if (err) return next(error(400, err));
    res.send(respond(201, res, '/'));
  });
});

// GET /api/courses/:courseId 200
  // Returns all Course properties and related user and review documents for the provided course ID
router.get('/:courseID', async (req, res) => {
  Course.findById(req.params.courseID)
    .populate('user', '_id fullName')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: '_id fullName' }
    })
    .exec((err, course) => err ? next(err) : res.json(course));
});

// PUT /api/courses/:courseId 204
  // Updates a course and returns no content
router.put('/:courseID', authenticate, (req, res, next) => {
  req.course.update(req.body).exec()
    .then(() => res.send(respond(204, res)))
    .catch(err => next(error(400, err)));
});

// POST /api/courses/:courseId/reviews 201
  // Creates a new review for a course, sets the Location header, and returns no content
router.post('/:courseID/reviews', authenticate, (req, res, next) => {
  const reviewerID = req.user._id.toString()
  const teacherID = req.course.user.toString();
  if (reviewerID === teacherID) return next(error(401, 'Reviewing your own class is not allowed'));

  const newReview = req.body;
  newReview.user = req.user._id;
  const review = new Review(newReview);

  review.save(err => {
    if (err) return next(error(400, err));

    Course.findById(req.course._id)
      .exec((err, course) => {
        course.reviews.push(review._id);
        course.save(err => { if (err) return next(error(400, err)) });
        res.send(respond(201, res, '/'));
      });
  });
});

module.exports = router;
