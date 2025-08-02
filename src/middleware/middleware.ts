import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/user-model";
import { IExtendedRequest } from "./type";



class Middleware {
  static async isLoggedIn(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ) {
    // check if login or not
    // token accept
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        message: "Please provide token",
      });
      return;
    }
    // token verification
    jwt.verify(token, "thisissecretkey", async (error, result: any) => {
      if (error) {
        res.status(403).json({
          message: "Token Invalid",
        });
        return;
      }

      const userData = await User.findByPk(result.id,{
        attributes: ['id','currentInstituteNumber']
      });
      if (!userData) {
        res.status(403).json({
          message: "No user with that id, invalid token",
        });
        return;
      }
      req.user = userData;
      next();
    });
  }
}

export default Middleware;
