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

router.param('menuId', (req, res, next, menuId) => {
  db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (err, menu) => {
    if (err) return next(err);
    if (!menu) return res.sendStatus(404);

    req.menu = menu;
    return next();
  });
});

router.get('/:menuId', (req, res, next) => {
  return res.status(200).send({ menu: req.menu });
});

router.put('/:menuId', (req, res, next) => {
  let { title } = req.body.menu;
  if (!title) return res.sendStatus(400);

  db.run(`
    UPDATE Menu SET title = $title
    WHERE Menu.id = ${req.menu.id}`,
    {
      $title: title
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.menu.id}`, (err, menu) => {
        if (err) return next(err);
        return res.status(200).send({ menu });
      });
    }
  );
});

router.delete('/:menuId', (req, res, next) => {
  db.get(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.menu.id}`, (err, menuItem) => {
    if (err) return next(err);
    if (menuItem) return res.sendStatus(400);

    db.run(`DELETE FROM Menu WHERE Menu.id = ${req.menu.id}`, err => {
      if (err) return next(err);
      return res.sendStatus(204);
    });
  });
});

module.exports = router;