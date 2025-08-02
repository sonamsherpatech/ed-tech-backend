import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import GenerateJWTTokenServices from "../../services/generate-jwt-token";

interface ITeacherData {
  teacherPassword: string;
  id: string;
}

class teacherController {
  static async teacherLogin(req: Request, res: Response) {
    const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body;
    if (!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
      res.status(400).json({
        message:
          "Please provide teacherEmail, teacherPassword and teacherInstituteNumber",
      });
      return;
    }

    const teacherData: ITeacherData[] = await sequelize.query(
      `SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [teacherEmail],
      }
    );

    if (teacherData.length === 0) {
      res.status(404).json({
        message: "Invalid Credentials",
      });
      return;
    }

    const isPasswordMatch = bcrypt.compareSync(
      teacherPassword,
      teacherData[0].teacherPassword
    );
    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Invalid Credentials",
      });
      return;
    }

    //token generation
    const token = GenerateJWTTokenServices.generateJWTToken({id:teacherData[0].id, instituteNumber: teacherInstituteNumber});

    res.status(200).json({
      message: "Teacher Logged In",
      token,
    });
  }
}

export default teacherController;
