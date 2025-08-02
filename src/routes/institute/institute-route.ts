import express, { Router } from "express";
import InstituteController from "../../controller/institute/institute-controller";
import Middleware from "../../middleware/middleware";
import ErrorHandlerService from "../../services/async-error-handler";

// import { multer, storage } from "./../../middleware/multer-middleware";
// const upload = multer({storage : storage})

const route: Router = express.Router();

route
  .route("/")
  .post(
    Middleware.isLoggedIn,
    InstituteController.createInstitute,
    InstituteController.createTeacherTable,
    InstituteController.createStudentTable,
    InstituteController.createCategoryTable,
    ErrorHandlerService.asyncErrorHandler(InstituteController.createCourseTable)
  );

export default route;
