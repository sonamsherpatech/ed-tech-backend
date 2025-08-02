import { config } from "dotenv";
config();

export const envConfig = {
  portNumber: process.env.PORT,

  //Mysql COnfig
  databaseName: process.env.DB_NAME,
  databaseUserName: process.env.DB_USERNAME,
  databasePassword: process.env.DB_PASSWORD,
  databasePort: process.env.DB_PORT,
  databaseHost: process.env.DB_HOST,

  //jwt
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  //cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecretKey: process.env.CLOUDINARY_SECRET_KEY,

  //app-password
  nodemailerGmail: process.env.NODEMAILER_GMAIL,
  nodemailerGmailAppPassword: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
};
