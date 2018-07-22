const express = require('express');
const apiRouter = express.Router();
const employeesRouter = require('./employees');

apiRouter.use('/employees', employeesRouter);

module.exports = apiRouter;