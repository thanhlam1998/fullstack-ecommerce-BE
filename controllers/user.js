const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  const products = [];

  const user = await User.findOne({ email: req.user.email }).exec();

  // check if cart with logged in user id already exist
  const cartExistsByThisUser = await Cart.findOne({ orderBy: user._id }).exec();

  if (cartExistsByThisUser) {
    cartExistsByThisUser.remove();
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

  const newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const allCart = await Cart.find({}).exec();

  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  if (cart) {
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({
      products,
      cartTotal,
      totalAfterDiscount,
    });
  }
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      address: req.body.address,
    }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.status(400).send("Invalid coupon");
  }

  const user = await User.findOne({ email: req.user.email }).exec();

  const { cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  })
    .populate("products.product", "_id title price")
    .exec();

  // calculate the total after discount
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json({ totalAfterDiscount });
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();

  const { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  // Decrease quantity, increase sold
  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item.product._id,
        },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = await Product.bulkWrite(bulkOption, {});
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};
