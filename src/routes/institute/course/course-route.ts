import express, { Request, Router } from "express";
import ErrorHandlerService from "../../../services/async-error-handler";
import CourseController from "../../../controller/institute/course/course-controller";
import Middleware from "../../../middleware/middleware";
import upload from "../../../middleware/multer-upload";

//locally
// import { multer, storage } from "./../../../middleware/multer-middleware";
// const upload = multer({ storage: storage });



const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    upload.single("courseThumbnail"),
    ErrorHandlerService.asyncErrorHandler(CourseController.createCourse)
  )
  .get(Middleware.isLoggedIn,ErrorHandlerService.asyncErrorHandler(CourseController.getAllCourses));

router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(CourseController.deleteCourse)
  )
  .get(Middleware.isLoggedIn,ErrorHandlerService.asyncErrorHandler(CourseController.getSingleCourse));

export default router;
