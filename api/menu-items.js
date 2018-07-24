const express = require('express');
const router = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res, next) => {
  db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.menu.id}`, (err, menuItems) => {
    if (err) return next(err);
    return res.status(200).send({ menuItems });
  });
});

module.exports = router;