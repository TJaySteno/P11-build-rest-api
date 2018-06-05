'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const seed = require('./middleware/seed');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

const app = express();

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// catch 404 and forward to global error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
    .send({
      message: err.message,
      error: err
    });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log('Express server is listening on port ' + server.address().port);
});
