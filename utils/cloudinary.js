const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const cloudinaryUploadImg = async (fileToUpLoads) => {
  // return console.log(fileToUpLoads);
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUpLoads, (result) => {
      console.log(result);
      resolve({
        url: result.secure_url,
        resource_type: "auto",
      });
    });
  });
};

module.exports = cloudinaryUploadImg;
