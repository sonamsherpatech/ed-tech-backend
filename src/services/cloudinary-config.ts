import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { envConfig } from "../config/config";
import { Request } from "express";

cloudinary.config({
  cloud_name: envConfig.cloudinaryCloudName,
  api_key: envConfig.cloudinaryAPIKey,
  api_secret: envConfig.cloudinarySecretKey,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req:Request, file:Express.Multer.File) => ({
    folder: "edtech-saas",
  }),
});

export { cloudinary, storage };
