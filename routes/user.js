const express = require("express");

const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    data: "Hey this is user API endpoint",
  });
});

module.exports = router;
