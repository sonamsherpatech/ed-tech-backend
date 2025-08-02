import express, { Request, Router } from "express";
import Middleware from "../../../middleware/middleware";
import ErrorHandlerService from "../../../services/async-error-handler";
import TeacherController from "../../../controller/institute/teacher/teacher-controller";
import upload from "../../../middleware/multer-upload";

const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    upload.single("teacherPhoto"),
    ErrorHandlerService.asyncErrorHandler(TeacherController.createTeacher)
  )
  .get(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(TeacherController.getTeachers)
  );

router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(TeacherController.deleteTeacher)
  );

export default router;
