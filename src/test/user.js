'use strict';

// Dependencies
const express  = require('express');
const mongoose = require('mongoose');
const seeder   = require('mongoose-seed');
const request  = require('supertest');
const chalk    = require('chalk');

// Local modules
const data   = require('../data/data');
const router = require('../routes/users');

// Initialize app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', router);

// Perform tests on requests to /api/users
describe(chalk.yellow('Seeding database'), () => {

  // Seed database prior to tests
  before(done => {
    seeder.connect('mongodb://localhost:27017/courseAPI', () => {

      // Load Mongoose models
      seeder.loadModels([
        './src/models/user.js',
        './src/models/review.js',
        './src/models/course.js'
      ]);

      // Clear specified collections
      seeder.clearModels(['User', 'Course', 'Review'], () => {
        console.log(chalk.yellow('  Models loaded and cleared'));

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, () => {
          console.log(chalk.green.bold('  Database seeding complete'));
          done();
        });
      });
    });

    const db = mongoose.connection;
    db.once('open', () => console.log(chalk.yellow('  Connected to database')));
  });

  // Disconnect after tests
  after(() => mongoose.disconnect());

  // GET /api/users with credentials
    // Corresponding user document should be returned
  describe(chalk.green('GET /api/users (with credentials)'), () => {
    it('Should return the corresponding user document', done => {
      request(app)
        .get('/api/users')
        .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  // GET /api/users with invalid credentials
    // 401 status error should be returned
  describe(chalk.green('GET /api/users (invalid credentials)'), () => {
    it('Should return 401 status error', done => {
      request(app)
        .get('/api/users')
        .expect(401, done);
    });
  });
});
