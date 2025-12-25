const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { requestLogger, errorHandler, notFound } = require("./middleware");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

// Export app
module.exports = app;
