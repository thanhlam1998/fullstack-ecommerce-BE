const express = require("express");

const router = express.Router();

router.get("/create-or-update-user", (req, res) => {
  res.json({
    data: "Hey this is create or update user api",
  });
});

module.exports = router;
