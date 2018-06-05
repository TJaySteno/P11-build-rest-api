'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// This is used with User.authenticate(cred)
UserSchema.statics.authenticate = (cred, req, next, err) => {
  // Find user based on email
  User.findOne({ emailAddress: cred.name })
    .exec((findErr, user) => {
      if (findErr) return next(findErr);
      if (!user) return next(err(404, 'Cannot find provided email address'));

      // Compare passwords
      bcrypt.compare(cred.pass, user.password, (bcryptErr, match) => {
        if (bcryptErr) return next(bcryptErr);
        if (!match) return next(err(401, 'Invalid password'));
        req.user = user;
        next();
      });
    });
};

UserSchema.pre('save', function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
