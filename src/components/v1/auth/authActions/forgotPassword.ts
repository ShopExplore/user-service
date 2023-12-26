import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { forgotPasswrdSchema } from "../auth.policies";
import UserModel from "../../user/user.model";
import AuthModel, { OtpModel } from "../auth.model";
import { _omit } from "../../../../utils/customLibrary";

async function forgotPassword(req: IRequest, res: Response) {
  const { email }: z.infer<typeof forgotPasswrdSchema> = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return handleResponse({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const userAuth = await AuthModel.findOne({
      User: existingUser._id,
    });
    if (!userAuth) {
      return handleResponse({
        res,
        status: 401,
        message: "Invalid login credentials",
      });
    }

    const verificationCode = userAuth.randomOTP();

    await new OtpModel({
      User: existingUser._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: "reset-password",
      isVerified: false,
    }).save();

    //send a mail
    console.log("new user verification:  ", verificationCode);

    return handleResponse({
      res,
      message: "verification code has been sent to your mail",
      data: {
        accountVerificationComplete: false,
      },
    });
  } catch (err) {
    handleResponse({
      res,
      err,
      message: "Internal Server Error",
    });
  }
}

export default forgotPassword;
