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

router.post('/', (req, res, next) => {
  const { name, description, inventory, price } = req.body.menuItem;
  if (!(name && description && inventory && price)) return res.sendStatus(400);

  db.run(`
    INSERT INTO MenuItem (name, description, inventory, price, menu_id)
    VALUES ($name, $description, $inventory, $price, $menu_id)`,
    {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menu_id: req.menu.id
    },
    function (err) {
      if (err) return next(err);
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (err, menuItem) => {
        if (err) return next(err);
        return res.status(201).send({ menuItem });
      });
    }
  );
});

router.param('menuItemId', (req, res, next, menuItemId) => {
  db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId}`, (err, menuItem) => {
    if (err) return next(err);
    if (!menuItem) return res.sendStatus(404);

    req.menuItem = menuItem;
    return next();
  });
});

router.get('/:menuItemId', (req, res, next) => {
  return res.status(200).send({ menuItem: req.menuItem });
});

router.put('/:menuItemId', (req, res, next) => {
  const { name, description, inventory, price } = req.body.menuItem;
  if (!(name && description && inventory && price)) return res.sendStatus(400);

  db.run(`
    UPDATE MenuItem SET name = $name,
      description = $description,
      inventory = $inventory,
      price = $price
    WHERE MenuItem.id = ${req.menuItem.id}`,
    {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price
    },
    err => {
      if (err) return next(err);
      db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.menuItem.id}`, (err, menuItem) => {
        if (err) return next(err);
        return res.status(200).send({ menuItem });
      });
    }
  );
});

module.exports = router;