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

module.exports = router;