import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    return res?.url;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    fs.unlinkSync(localFilePath); // Remove the locally temp file as the upload got failed
  }
};

export { uploadOnCloudinary };
