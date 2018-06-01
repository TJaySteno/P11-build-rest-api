'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create answer schema
const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'User name is required']
  },
  emailAddress: {
    type: String,
    required: [true, 'User email is required'],
    unique: [true, 'This email is already being used'],
    validate: {
      validator: email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: '{VALUE} is not a valid email address!'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
