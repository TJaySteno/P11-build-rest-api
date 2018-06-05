'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  postedOn: { type: Date, default: Date.now() },
  rating: {
    type: Number,
    required: [true, 'Rating of 1 to 5 is required'],
    min: [1, 'Rating cannot be below 1'],
    max: [5, 'Rating cannot be above 5']
  },
  review: String
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = { Review };
