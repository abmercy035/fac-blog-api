const express = require("express")
const router = express.Router()
const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post("/sign", (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_API_SECRET)
    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to sign upload" })
  }
})

module.exports = router
