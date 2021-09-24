const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  const products = [];

  const user = await User.findOne({ email: req.user.email }).exec();

  // check if cart with logged in user id already exist
  const cartExistsByThisUser = await Cart.findOne({ orderBy: user._id }).exec();

  if (cartExistsByThisUser) {
    cartExistsByThisUser.remove();
    console.log("Removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    const object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    const { price } = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = price;

    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  const newCart = new Cart({
    products,
    cartTotal,
    orderBy: user._id,
  }).save();
  console.log("new cart", newCart);
  res.json({ ok: true });
};
