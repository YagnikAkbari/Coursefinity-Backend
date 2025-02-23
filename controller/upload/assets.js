const { uploadCloudinary } = require("../../helpers/uploadAssets/cloudinary");

const uploadAsset = async (req, res, next) => {
  try {
    const { originalname: file_name, destination, mimetype } = req.file;
    const uploadResult = await uploadCloudinary({
      file_path: `${destination}/${file_name}`,
      resource_type: mimetype.split("/")[0],
    });
    const {
      success,
      data: { secure_url, url, original_filename, display_name },
    } = uploadResult;

    if (success) {
      return res.status(200).send({
        message: "Asset Upload Successul.",
        data: {
          url: secure_url ?? url,
          alt: original_filename ?? display_name,
        },
      });
    } else {
      return res
        .status(uploadResult.code)
        .send({ message: uploadResult.message });
    }
  } catch (err) {
    console.log("ASSETUPLOADERROR", err);
  }
};

module.exports = { uploadAsset };
