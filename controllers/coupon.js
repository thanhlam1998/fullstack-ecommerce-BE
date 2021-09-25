const Coupon = require("../models/coupon");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body;
    res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (error) {
    return res.status(400).send("Create discount failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await Coupon.find({}).sort({ created_at: -1 }).exec());
  } catch (error) {
    return res.status(400).send("Can't load data");
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndRemove(req.params.couponId).exec());
  } catch (error) {
    return res.status(400).send("Remove discount failed");
  }
};
