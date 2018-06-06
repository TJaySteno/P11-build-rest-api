'use strict';

const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');

const { Schema } = mongoose;

// Create answer schema
const UserSchema = new Schema({
  fullName: { type: String, required: [true, 'User name is required'] },
  emailAddress: {
    type: String,
    required: [true, 'User email is required'],
    unique: [true, 'This email is already being used'],
    validate: {
      validator: email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: '{VALUE} is not a valid email address!'
    }
  },
  password: { type: String, required: [true, 'Password is required'] }
});

// Check a user's credentials and save user to 'req.user' unless errors arise
UserSchema.statics.authenticate = (cred, req, next, error) => {
  User.findOne({ emailAddress: cred.name })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(error(404, 'Cannot find provided email address'));

      // Compare passwords and store user (but not their password)
      bcrypt.compare(cred.pass, user.password, (e, match) => {
        if (e) return next(e);
        if (!match) return next(error(401, 'Invalid password'));

        const { _id, fullName, emailAddress, __v } = user;
        req.user = { _id, fullName, emailAddress, __v };
        next();
      });
    });
};

// Before saving a new user, hash their password for security
UserSchema.pre('save', function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
