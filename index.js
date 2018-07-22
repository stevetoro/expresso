const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(errorhandler());

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}.`);
});