const fs = require("fs");

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

module.exports = { deleteFile };
