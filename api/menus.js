const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, menus) => {
    if (err) return next(err);
    return res.status(200).send({ menus });
  });
});

router.post('/', (req, res, next) => {
  let { title } = req.body.menu;
  if (!title) return res.sendStatus(400);

  db.run(`
    INSERT INTO Menu (title)
    VALUES ($title)`,
    {
      $title: title
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (err, menu) => {
        if (err) return next(err);
        return res.status(201).send({ menu });
      });
    }
  );
});

module.exports = router;