const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const {
  requestLogger,
  errorHandler,
  notFound,
} = require('./middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(requestLogger);
app.use(notFound);

app.use('/api', routes);

// Export app
module.exports = app;
