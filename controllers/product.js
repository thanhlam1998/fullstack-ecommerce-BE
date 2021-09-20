// @ts-nocheck
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

exports.read = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};
