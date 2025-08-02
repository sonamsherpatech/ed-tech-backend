import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";

class GenerateJWTTokenServices {
  static generateJWTToken(data: {
    id: string,
    instituteNumber ?: string
  }) {
    //@ts-ignore
    const token = jwt.sign(data , envConfig.jwtSecretKey, {
      expiresIn: envConfig.jwtExpiresIn,
    });
    return token;
  }
}

export default GenerateJWTTokenServices;
