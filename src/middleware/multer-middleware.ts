import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, "./src/storage");
  },
  //cb-->callback
  //cb(error, sucesss)
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export { multer, storage };

// class MulterMiddleware {
//     multer.diskStorate
// }

// export default MulterMiddleware
