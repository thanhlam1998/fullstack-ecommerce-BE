const express = require("express");
const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/auth");

// controller
const { userCart, getUserCart, emptyCart } = require("../controllers/user");

// routes
router.get("/user/cart", authCheck, getUserCart);
router.post("/user/cart", authCheck, userCart);
router.put("/user/cart", authCheck, emptyCart);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "Hey this is user API endpoint",
//   });
// });

module.exports = router;
