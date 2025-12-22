const searchRouter = require("express").Router();

searchRouter.get("/search", (req, res) => {
    res.json("search api");
})

module.exports = searchRouter;