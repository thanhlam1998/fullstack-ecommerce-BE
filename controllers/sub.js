const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

/**
 * name: String
 * slug: String
 */

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    // @ts-ignore
    res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
  } catch (error) {
    res.status(400).send("Sub create failed");
  }
};

// @ts-ignore
exports.list = async (req, res) => {
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
  const sub = await Sub.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ subs: sub }).populate("subs").exec();
  res.json({
    sub,
    products,
  });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    // @ts-ignore
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      // @ts-ignore
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Sub update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Sub delete failed");
  }
};
