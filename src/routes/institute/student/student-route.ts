import express, { Router } from "express";
import ErrorHandlerService from "../../../services/async-error-handler";
import StudentController from "../../../controller/institute/student/student-controller";

const router: Router = express.Router();

router
  .route("/")
  .get(ErrorHandlerService.asyncErrorHandler(StudentController.getStudents));

export default router;
