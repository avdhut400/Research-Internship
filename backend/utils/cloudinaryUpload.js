const cloudinary = require(
  "../config/cloudinary"
);

const uploadImageBuffer = (
  fileBuffer,
  folderName
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(uploadResult);
        }
      );

    uploadStream.end(fileBuffer);
  });
};

const deleteCloudinaryImage = async (
  publicId
) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadImageBuffer,
  deleteCloudinaryImage,
};