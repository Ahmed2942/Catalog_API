const express = require("express");
const app = express();
const importRouter = require("./routes/import.routes.js");
const searchRouter = require("./routes/search.routes.js");

app.use("/api", importRouter);
app.use("/api", searchRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



module.exports = app;
