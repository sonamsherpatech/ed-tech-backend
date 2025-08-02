import express, { Router } from "express";
import teacherController from "../../controller/teacher/teacher-controller";
import ErrorHandlerService from "../../services/async-error-handler";

const route: Router = express.Router();

route
  .route("/")
  .post(ErrorHandlerService.asyncErrorHandler(teacherController.teacherLogin));

export default route;
