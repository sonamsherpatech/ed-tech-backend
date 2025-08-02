import bcrypt from "bcrypt";

class GeneratePasswordService {
  static  generateRandomPassword(teacherName: string) {
    const randomNumber = Math.floor(1000 + Math.random() * 90000);
    const passwordData = {
      hashedVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`, 10),
      plainVersion: `${randomNumber}_${teacherName}`,
    };
    return passwordData;
  }
}

export default GeneratePasswordService;
