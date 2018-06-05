const mongoose = require('mongoose');
const seeder = require('mongoose-seed');
const data = require('../data/data');

const seedDB = () => {
  seeder.connect('mongodb://localhost:27017/courseAPI', err => {

    // Load Mongoose models
    seeder.loadModels([
      './src/models/user.js',
      './src/models/review.js',
      './src/models/course.js'
    ]);

    // Clear specified collections
    seeder.clearModels(['User', 'Course', 'Review'], () => {

      // Callback to populate DB once collections have been cleared
      seeder.populateModels(data, function() {
        console.log('Models populated\nAPI ready...');

      });
    });
  });

  const db = mongoose.connection;
  db.on('error', err => console.error('Connection error:', err));
  db.once('open', () => console.log('Connected to database'));
}

seedDB();

const seed = (req, res, next) => seedDB(next());

module.module = {seed};
