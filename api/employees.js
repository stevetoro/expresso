const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Employee WHERE Employee.is_currently_employed = 1`, (err, employees) => {
    if (err) return next(err);
    return res.status(200).send({ employees });
  });
});

module.exports = router;