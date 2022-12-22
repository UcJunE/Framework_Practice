const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary");

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

router.get("/sign", async (req, res) => {
  //retrive param we need to send to cloudinary , DF IS THE PARAMS
  const params_to_sign = JSON.parse(req.query.params_to_sign);
  // get our api secret from .env
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  //get signature aka CSRF
  const signature = cloudinary.utils.api_sign_request(
    params_to_sign,
    apiSecret
  );
  res.send(signature);
});

module.exports = router;
