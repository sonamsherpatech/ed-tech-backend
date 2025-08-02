import express, { Router } from "express";
import Middleware from "../../../middleware/middleware";
import ErrorHandlerService from "../../../services/async-error-handler";
import CategoryController from "../../../controller/institute/category/category-controller";

const router: Router = express.Router();

router
  .route("/")
  .post(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(CategoryController.createCategory)
  )
  .get(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(CategoryController.getCategories)
  );

router
  .route("/:id")
  .delete(
    Middleware.isLoggedIn,
    ErrorHandlerService.asyncErrorHandler(CategoryController.deleteCategory)
  );

export default router;
