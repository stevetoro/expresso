const express = require('express');
const router = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Timesheet WHERE Timesheet.employee_id = ${req.params.employeeId}`, (err, timesheets) => {
    if (err) return next(err);
    return res.status(200).send({ timesheets });
  });
});

router.post('/', (req, res, next) => {
  const { hours, rate = req.employee.wage, date = Date(new Date()) } = req.body.timesheet;
  if (!hours) return res.sendStatus(400);

  db.run(`
    INSERT INTO Timesheet (hours, rate, date, employee_id)
    VALUES ($hours, $rate, $date, $employee_id)`,
    {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employee_id: req.employee.id,
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (err, timesheet) => {
        if (err) return next(err);
        return res.status(201).send({ timesheet });
      });
    }
  );
});

router.param('timesheetId', (req, res, next, timesheetId) => {
  db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`, (err, timesheet) => {
    if (err) return next(err);
    if (!timesheet) return res.sendStatus(404);

    req.timesheet = timesheet;
    return next();
  });
});

router.get('/:timesheetId', (req, res, next) => {
  return res.status(200).send({ timesheet: req.timesheet });
});

module.exports = router;