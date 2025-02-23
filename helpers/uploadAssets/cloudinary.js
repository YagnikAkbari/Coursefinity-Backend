const { deleteFile } = require("../../utils/delete");

const cloudinary = require("cloudinary").v2;
// const { cloudinaryConfig } = require("../../config/cloudinary");
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   upload_prefix: process.env.CLOUDINARY_UPLOAD_PREFIX,
//   secure: false
// });

const uploadCloudinary = async (fileConfig) => {
  const { folder = "", file_path, resource_type } = fileConfig;
  try {
    const result = await cloudinary.uploader.upload(file_path, {
      folder,
      use_filename: true,
      resource_type,
    });
    await deleteFile(file_path);

    return { success: true, data: result };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      code: err?.code,
      message: err?.message,
    };
  }
};

module.exports = { uploadCloudinary };
