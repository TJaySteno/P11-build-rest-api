'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create answer schema
const CourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Course title required']
  },
  description: {
    type: String,
    required: [true, 'Course description required']
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [
    {
      stepNumber: Number,
      title: {
        type: String,
        required: [true, 'Step title required']
      },
      description: {
        type: String,
        required: [true, 'Step description required']
      }
    }
  ],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = { Course };
