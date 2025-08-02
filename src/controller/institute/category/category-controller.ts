import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

class CategoryController {
  static async createCategory(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName || !categoryDescription) {
      res.status(400).json({
        message: "Please provide categoryName and categoryDescription ",
      });
      return;
    }

    await sequelize.query(
      `INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?,?)`,
      {
        replacements: [categoryName, categoryDescription],
        type: QueryTypes.INSERT,
      }
    );

    res.status(200).json({
      message: "Category Added sucessfully",
    });
  }

  static async getCategories(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;

    const categories = await sequelize.query(
      `SELECT * FROM category_${instituteNumber}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Categories fetched sucessfully",
      data: categories,
    });
  }

  static async deleteCategory(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const categoryId = req.params.id;

    await sequelize.query(
      `DELETE FROM category_${instituteNumber} WHERE id = ? `,
      {
        replacements: [categoryId],
        type: QueryTypes.DELETE,
      }
    );

    res.status(200).json({
      message: "Category deleted sucessfully",
    });
  }
}

export default CategoryController;
