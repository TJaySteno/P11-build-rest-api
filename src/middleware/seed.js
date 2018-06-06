'use strict';

const mongoose = require('mongoose');
const seeder   = require('mongoose-seed');
const chalk    = require('chalk');

const data     = require('../data/data');

const seedDB = () => {
  console.log(chalk.yellow('  Seeding database'));
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
        console.log(chalk.green('  Database seeding complete'));

      });
    });
  });

  const db = mongoose.connection;
  db.once('open', () => console.log(chalk.yellow('  Connected to database')));
}

seedDB();

const seed = (req, res, next) => seedDB(next());

module.module = {seed};
