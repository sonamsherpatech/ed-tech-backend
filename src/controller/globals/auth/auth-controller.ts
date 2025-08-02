/*
FEATURES:
    - REGISTER,
        PROCESS:
            -Incoming data --> username, email, password
            -Data Processing/Checking --> email validation, required field data
            -Database Query --> insert/read/delete/update
    - LOGIN,
        PROCESS:
            - email/username and password login
              - email and password --> data accept
              - validation
                - proper emial format
              -verification
                - first check email exist or not
                - if yes, check password
                  - if password match, login sucessful with token generation (via jwt package)
                - if no, response with error

            -google Login
            -email login(SSO)
    - LOGOUT,
    - FORGOT PASSWORD 

*/

import { Request, Response } from "express";
import User from "../../../database/models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async registerUser(req: Request, res: Response) {
    if (req.body == undefined) {
      res.status(400).json({
        message: "No data was sent!!",
      });
      return;
    }

    // accept incoming data
    const { username, email, password } = req.body;

    //data processing and checking
    if (!username || !password || !email) {
      return res.status(400).json({
        message: "Please provide username, password, email",
      });
    }
    //db query --> insert into Users table
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 12),
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  }

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Provide email and password",
      });
      return;
    }

    // check if email exist or not in our user table
    const data = await User.findAll({
      where: {
        email,
      },
    });

    if (data.length == 0) {
      res.status(404).json({
        message: "Invalid Credential",
      });
    } else {
      // check password
      const isPasswordMatch = bcrypt.compareSync(password, data[0].password);
      if (!isPasswordMatch) {
        res.status(403).json({
          message: "Invalid Credential",
        });
        return;
      }
      //token generation via jsonwebtoken (jwt)

      const token = jwt.sign({ id: data[0].id }, "thisissecretkey", {
        expiresIn: "30d",
      });
      res.status(200).json({
        token,
        message: "Sucessfull Login",
      });
    }
  }

  static async forgotPassword() {}
}

export default AuthController;
