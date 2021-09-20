// @ts-nocheck
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};

exports.remove = async (req, res) => {
  const image_id = req.body.public_id;

  cloudinary.v2.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("ok");
  });
};
