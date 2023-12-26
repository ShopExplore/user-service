import { NextFunction, Response } from "express";
import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import UserModel from "../../user/user.model";
import UserAuth from "../auth.model";

const requireAuthMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.decoded) {
    return handleResponse({
      res,
      message: "authentication is required",
      status: 401,
    });
  }

  const { ref, role } = req.decoded;

  try {
    const user = await UserModel.findById(ref);

    if (!user) {
      return handleResponse({
        res,
        message: "authorization failed",
        status: 401,
      });
    }

    const userAuth = await UserAuth.findOne({
      User: user._id,
    });

    if (!userAuth) {
      return handleResponse({
        res,
        message: "authorization failed",
        status: 401,
      });
    }

    // if (
    //   Date.now() - new Date(userAuth.lastLoginAt).getTime() >
    //   session.maxInactivity
    // ) {
    //   return handleResponse({
    //     res,
    //     message: "session has expired, pls login",
    //     status: 401,
    //   });
    // }

    // userAuth.lastLoginAt = new Date();
    // await userAuth.save();

    req.user = user;
    req.userAuth = userAuth;
    req.role = role;
    return next();
  } catch (err) {
    return handleResponse({
      res,
      message: "Authentication error",
      status: 401,
      err,
    });
  }
};
export default requireAuthMiddleware;
