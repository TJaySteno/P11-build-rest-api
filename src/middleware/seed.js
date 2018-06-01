const seeder = require('mongoose-seed');
const data = require('../data/data');

const seedDB = async () => {
  try {
    seeder.connect('mongodb://localhost:27017/courseAPI', function () {

      // Load Mongoose models
      seeder.loadModels([
        './src/models/user.js',
        './src/models/review.js',
        './src/models/course.js'
      ]);
      console.log('Models loaded');

      // Clear specified collections
      seeder.clearModels(['User', 'Course', 'Review'], function() {
        console.log('Models cleared');

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function() {
          console.log('Seeding complete');

        }, err => { if (err) console.error('Error clearing models:', err) });
      }, err => { if (err) console.error('Error clearing models:', err) });
    });
  } catch (err) { console.error('Console error:', err); }
}

seedDB();

const seed = (req, res, next) => seedDB(next());

module.module = {seed};
