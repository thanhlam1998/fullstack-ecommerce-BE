const express = require("express");
const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/auth");

// controller
const { userCart, getUserCart } = require("../controllers/user");

// routes
router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "Hey this is user API endpoint",
//   });
// });

module.exports = router;
