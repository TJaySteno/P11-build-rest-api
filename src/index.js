'use strict';

/* Dependencies */
const express      = require('express');
const morgan       = require('morgan');
const chalk        = require('chalk');

/* Local modules */
// const seed         = require('./middleware/seed');
const error        = require('./middleware/error');
const userRoutes   = require('./routes/users');
const courseRoutes = require('./routes/courses');

/* Initialize Express */
const app = express();
app.set('port', process.env.PORT || 5000);

/* Middleware */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Set up routes */
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

/* Catch 404 errors */
app.use((req, res, next) => next(error(404, 'File Not Found')));

/* Global error handler */
app.use((err, req, res) =>
  res.status(err.status || 500)
    .send({ message: err.message, error: err }));

/* Listen on our port */
const server = app.listen(app.get('port'), () =>
  console.log(chalk.cyan('  Express server is listening on port ' + server.address().port)));
