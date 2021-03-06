const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
const timesheetsRouter = require('./timesheets');

router.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Employee WHERE Employee.is_currently_employed = 1`, (err, employees) => {
    if (err) return next(err);
    return res.status(200).send({ employees });
  });
});

router.post('/', (req, res, next) => {
  const { name, position, wage, is_currently_employed = 1 } = req.body.employee;
  if (!(name && position && wage)) return res.sendStatus(400);

  db.run(`
    INSERT INTO Employee (name, position, wage, is_currently_employed)
    VALUES ($name, $position, $wage, $is_currently_employed)`, 
    {
      $name: name,
      $position: position,
      $wage: wage,
      $is_currently_employed: is_currently_employed,
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (err, employee) => {
        if (err) return next(err);
        return res.status(201).send({ employee });
      });
    }
  );
});

router.param('employeeId', (req, res, next, employeeId) => {
  db.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`, (err, employee) => {
    if (err) return next(err);
    if (!employee) return res.sendStatus(404);
    
    req.employee = employee;
    return next();
  });
});

router.get('/:employeeId', (req, res, next) => {
  return res.status(200).send({ employee: req.employee });
});

router.put('/:employeeId', (req, res, next) => {
  const { name, position, wage, is_currently_employed = 1 } = req.body.employee;
  if (!(name && position && wage)) return res.sendStatus(400);

  db.run(`
    UPDATE Employee SET name = $name,
      position = $position,
      wage = $wage,
      is_currently_employed = $is_currently_employed
    WHERE Employee.id = ${req.params.employeeId}`,
    {
      $name: name,
      $position: position,
      $wage: wage,
      $is_currently_employed: is_currently_employed,
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (err, employee) => {
        if (err) return next(err);
        return res.status(200).send({ employee });
      }); 
    }
  );
});

router.delete('/:employeeId', (req, res, next) => {
  db.run(`
    UPDATE Employee SET is_currently_employed = 0
    WHERE Employee.id = ${req.params.employeeId}`,
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (err, employee) => {
        if (err) return next(err);
        return res.status(200).send({ employee });
      });
    }
  );
});

router.use('/:employeeId/timesheets', timesheetsRouter);

module.exports = router;