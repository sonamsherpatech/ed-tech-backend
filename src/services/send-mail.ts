import nodemailer from "nodemailer";
import { envConfig } from "../config/config";

interface IMailInformation {
  to: string;
  subject: string;
  text: string;
}

class SendMailServices {
  static async sendMail(mailInformation: IMailInformation) {
    //step1: create nodemailer transport which is a configuration for nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: envConfig.nodemailerGmail,
        pass: envConfig.nodemailerGmailAppPassword,
      },
    });

    const mailFormatObject = {
      from: "SaaS MERN <sonam.sherpa.tech@gmail.com>",
      to: mailInformation.to,
      subject: mailInformation.subject,
      text: mailInformation.text,
    };

    try {
      await transporter.sendMail(mailFormatObject);
    } catch (error) {
      console.log(error);
    }
  }
}

export default SendMailServices;
