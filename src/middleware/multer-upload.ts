import multer from "multer";
import { storage } from "./../services/cloudinary-config";
import { Request } from "express";

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only png, jpg and jpeg file types are allowed"));
    }
  },
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export default upload