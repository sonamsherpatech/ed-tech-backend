import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { IExtendedRequest } from "../../../middleware/type";
import { QueryTypes } from "sequelize";

class CourseController {
//Insert Course 

  static async createCourse(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;

    const {
      courseName,
      courseDescription,
      coursePrice,
      courseDuration,
      courseLevel,
      categoryId,
    } = req.body;
    // const { courseThumbnail } = req.file;

    if (
      !courseName ||
      !courseDescription ||
      !coursePrice ||
      !courseDuration ||
      !courseLevel ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide courseName, courseDescription, coursePrice, courseDuration, courseLevel, category",
      });
      return;
    }

    const courseThumbnail = req.file ? req.file.path : null;

    await sequelize.query(
      `INSERT INTO course_${instituteNumber} (courseName, courseDescription, coursePrice, courseDuration, courseLevel,courseThumbnail,categoryId) VALUES (?,?,?,?,?,?,?)`,
      {
        replacements: [
          courseName,
          courseDescription,
          coursePrice,
          courseDescription,
          courseLevel,
          courseThumbnail,
          categoryId,
        ],
        type: QueryTypes.INSERT,
      }
    );

    res.status(200).json({
      message: "Course Inserted Sucessfully",
    });
  }

  //Delete Course
  static async deleteCourse(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;

    const courseId = req.params.id;
    const course = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
      {
        replacements: [courseId],
        type: QueryTypes.SELECT,
      }
    );

    if (course.length == 0) {
      res.status(400).json({
        message: "Course doesn't exists",
      });
      return;
    }

    await sequelize.query(
      `DELETE FROM course_${instituteNumber} WHERE id = ?`,
      {
        replacements: [courseId],
        type: QueryTypes.DELETE,
      }
    );
    res.status(200).json({
      message: "Course deleted sucessfully",
    });
  }

  //List all Courses
  static async getAllCourses(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courses = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} JOIN category_${instituteNumber} ON course_${instituteNumber}.categoryId = category_${instituteNumber}.id `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "All courses extracted",
      data: courses,
    });
  }

  static async getSingleCourse(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;

    const [course] = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
      {
        replacements: [courseId],
      }
    );
    res.status(200).json({
      message: "Single course fetched",
      data: course,
    });
  }
}

export default CourseController;
