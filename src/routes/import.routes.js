const importRouter = require("express").Router();

importRouter.post("/import", (req, res) => {
  res.json("import api");
})

module.exports = importRouter;