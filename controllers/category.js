const Category = require("../models/category");
const Sub = require("../models/sub");
const slugify = require("slugify");

/**
 * name: String
 * slug: String
 */

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    // @ts-ignore
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (error) {
    res.status(400).send("Category create failed");
  }
};

// @ts-ignore
exports.list = async (req, res) => {
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  res.json(category);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    // @ts-ignore
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      // @ts-ignore
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Category delete failed");
  }
};

exports.getSubs = async (req, res) => {
  Sub.find({ parent: req.params._id }).exec((err, subs) => {
    if (err) {
      console.log(err);
    }
    res.json(subs);
  });
};
