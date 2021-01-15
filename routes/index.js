const createError = require('http-errors');
const errorHandler = require('../middleware/errorHandler');

const deviceRouter = require('./device');
const authRouter = require('./auth');

module.exports = (app) => {
  // all of our routes will be prefixed with /api
  app.use('/api', authRouter);
  app.use('/api', deviceRouter);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError.NotFound());
  });

  // pass any errors to the error handler
  app.use(errorHandler);
};
