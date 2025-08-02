import express, { Router } from "express";
import AuthController from "../../../controller/globals/auth/auth-controller";
import ErrorHandlerService from "../../../services/async-error-handler";
const router: Router = express.Router();

router
  .route("/register")
  .post(ErrorHandlerService.asyncErrorHandler(AuthController.registerUser));
router
  .route("/login")
  .post(ErrorHandlerService.asyncErrorHandler(AuthController.loginUser));

export default router;
