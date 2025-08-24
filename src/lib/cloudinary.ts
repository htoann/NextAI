import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBase64ToCloudinary = async (base64: string, folder = 'gemini') => {
  try {
    const upload = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, { folder });
    return upload.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export default cloudinary;
