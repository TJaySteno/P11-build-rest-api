const seeder = require('mongoose-seed');
const data = require('../data/data');

const seedDB = async () => {
  try {
    // Connect to MongoDB via Mongoose
    await seeder.connect('mongodb://localhost/courseAPI', err => {
      if (err) console.error('Connection error:', err)});
    console.log('Connected to database');

    // Load Mongoose models
    await seeder.loadModels([
      './src/models/user.js',
      './src/models/review.js',
      './src/models/course.js'
    ]);
    console.log('Models loaded');

    // Clear specified collections
    await seeder.clearModels(['User', 'Review', 'Course'], err => {
      if (err) console.error('Error clearing models:', err)});
    console.log('Old stores cleared');

    // Callback to populate DB once collections have been cleared
    await seeder.populateModels(data, err => {
      if (err) console.error('Error populating models:', err)});
    console.log('Models populated');

  } catch (err) {
    console.error('Console error:', err);
  }
}

seedDB();

const seed = (req, res, next) => seedDB(next());

module.module = {seed};
