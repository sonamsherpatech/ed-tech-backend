import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import { IExtendedRequest } from "../../middleware/type";
import User from "../../database/models/user-model";
import InstituteNumberGeneratorService from "../../services/generate-random-institute-number";
import categories from "../../seed";
import { QueryTypes } from "sequelize";

class InstituteController {
  static async createInstitute(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // console.log(req.user);
      const {
        instituteName,
        instituteEmail,
        institutePhoneNumber,
        instituteAddress,
      } = req.body;

      const instituteVatNo = req.body.instituteVatNo || null;
      const institutePanNo = req.body.institutePanNo || null;

      if (
        !instituteName ||
        !instituteEmail ||
        !instituteAddress ||
        !institutePhoneNumber
      ) {
        res.status(400).json({
          message:
            "Please Provide instituteName,instituteEmail,institutePhoneNumber, instituteAddress",
        });
        return;
      }

      // User.findByPk(req.user && req.user.id);

      //Create Insititute
      const instituteNumber =
        InstituteNumberGeneratorService.generateRandomInstituteNumber();

      await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            institutePanNo VARCHAR(255),
            instituteVatNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

      await sequelize.query(
        `INSERT INTO institute_${instituteNumber}(instituteName, instituteEmail, institutePhoneNumber,instituteAddress, institutePanNo, instituteVatNo) VALUES (?,?,?,?,?,?)`,
        {
          replacements: [
            instituteName,
            instituteEmail,
            institutePhoneNumber,
            instituteAddress,
            institutePanNo,
            instituteVatNo,
          ],
          type: QueryTypes.INSERT,
        }
      );

      //to create user_institute hsitory table where users number of institute the user have created will be stored
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
        id VARCHAR(36) PRIMARY KEY DEFAULT(UUID()),
        userId VARCHAR(36) REFERENCES users(id),
        instituteNumber VARCHAR(256) UNIQUE
      )`);

      if (req.user) {
        await sequelize.query(
          `INSERT INTO user_institute (userId,instituteNumber) VALUES (?,?)`,
          {
            replacements: [req.user.id, instituteNumber],
            type: QueryTypes.INSERT,
          }
        );

        await User.update(
          {
            currentInstituteNumber: instituteNumber,
            role: "institute  ",
          },
          {
            where: {
              id: req.user.id,
            },
          }
        );
      }

      if (req.user) {
        req.user.currentInstituteNumber = instituteNumber;
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  static async createTeacherTable(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        teacherName VARCHAR(255) NOT NULL,
        teacherEmail VARCHAR(255) NOT NULL UNIQUE,
        teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        teacherExpertise VARCHAR(255),
        joinedDate DATE,
        salary VARCHAR(100),
        teacherPhoto VARCHAR(255),
        teacherPassword VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      next();
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  }

  static async createStudentTable(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        studentName VARCHAR(255) NOT NULL,
        studentEmail VARCHAR(255) NOT NULL UNIQUE,
        studentPhoneNumber VARCHAR(255) NOT NULL ,
        studentAddress TEXT,
        enrolledDate DATE,
        studentImage VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);
      next();
    } catch (error) {
      message: error;
    }
  }

  static async createCourseTable(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber} (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        courseName VARCHAR(255) NOT NULL,
        courseDescription TEXT NOT NULL,
        coursePrice VARCHAR(255) NOT NULL,
        courseDuration VARCHAR(100) NOT NULL,
        courseLevel ENUM('beginner','intermediate','advance') NOT NULL,
        courseThumbnail VARCHAR(255),
        teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber}(id),
        categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber}(id),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`);

    res.status(200).json({
      message: "Create Institute Sucessfully",
      instituteNumber,
    });
  }

  static async createCategoryTable(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    const instituteNumber = req.user?.currentInstituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      categoryName VARCHAR (255) NOT NULL,
      categoryDescription TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    categories.forEach(async function (category) {
      await sequelize.query(
        `INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?,?)`,
        {
          replacements: [category.categoryName, category.categoryDescription],
        }
      );
    });

    next();
  }
}

export default InstituteController;
