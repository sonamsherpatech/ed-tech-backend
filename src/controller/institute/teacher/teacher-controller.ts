import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import GeneratePasswordService from "../../../services/generate-random-password";
import SendMailServices from "../../../services/send-mail";

class TeacherController {
  static async createTeacher(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const {
      teacherName,
      teacherEmail,
      teacherPhoneNumber,
      teacherExpertise,
      joinedDate,
      salary,
      courseId,
    } = req.body;
    if (!teacherName || !teacherEmail || !teacherPhoneNumber) {
      res.status(400).json({
        message: "Please provide teacherName, teacherEmail, teacherPhoneNumber",
      });
      return;
    }
    const teacherPhoto = req.file
      ? req.file.path
      : "https://imgs.search.brave.com/-Q4gc0dPWnhnl8AHIbgIZb8k0-WNm52-G2dG2EdNhw4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC8y/Ni8zOS9wcm9maWxl/LXBsYWNlaG9sZGVy/LWltYWdlLWdyYXkt/c2lsaG91ZXR0ZS12/ZWN0b3ItMjIxMjI2/MzkuanBn ";

    //password generate function
    const data = GeneratePasswordService.generateRandomPassword(teacherName);
    await sequelize.query(
      `INSERT INTO teacher_${instituteNumber} (teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, joinedDate, teacherPhoto, salary, teacherPassword) VALUES (?,?,?,?,?,?,?,?)`,
      {
        replacements: [
          teacherName,
          teacherEmail,
          teacherPhoneNumber,
          teacherExpertise,
          joinedDate,
          teacherPhoto,
          salary,
          data.hashedVersion,
        ],
        type: QueryTypes.INSERT,
      }
    );

    const teacherData: { id: string }[] = await sequelize.query(
      `SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [teacherEmail],
      }
    );

    await sequelize.query(
      `UPDATE course_${instituteNumber} SET teacherId = ?  WHERE id = ?`,
      {
        type: QueryTypes.UPDATE,
        replacements: [teacherData[0].id, courseId],
      }
    );

    //send mail
    const mailInformation = {
      to: teacherEmail,
      subject: "Welcome to our Edtech platform",
      text: `Welcome xa haii,\nEmail: ${teacherEmail}\nPassword: ${data.plainVersion}\nYour Institute Number: ${instituteNumber}`,
    };
    await SendMailServices.sendMail(mailInformation);

    res.status(200).json({
      message: "Teacher Created Sucessfully",
    });
  }

  static async getTeachers(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const teachersData = await sequelize.query(
      `SELECT * FROM teacher_${instituteNumber}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({
      message: "Teacher fetched sucessfully",
      data: teachersData,
    });
  }

  static async deleteTeacher(req: IExtendedRequest, res: Response) {
    const instituteNumber = req.user?.currentInstituteNumber;
    const teacherId = req.params.id;
    await sequelize.query(
      `DELETE FROM teacher_${instituteNumber} WHERE id = ?`,
      {
        type: QueryTypes.DELETE,
        replacements: [teacherId],
      }
    );

    res.status(200).json({
      message: "Teacher deleted sucessfully",
    });
  }
}

export default TeacherController;
