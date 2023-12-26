import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { resendOtpSchema } from "../auth.policies";
import UserModel from "../../user/user.model";
import { OtpModel } from "../auth.model";
import AuthModel from "../auth.model";

async function resendOtp(req: IRequest, res: Response) {
  const { email, otpPurpose }: z.infer<typeof resendOtpSchema> = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return handleResponse({
        res,
        status: 404,
        message: "There was a problem at this time, pls wait some minutes",
      });
    }

    const userAuth = await AuthModel.findOne({ User: user._id });
    if (!userAuth) {
      return handleResponse({
        res,
        message: "There was a problem at this time, pls wait some minutes",
        status: 404,
      });
    }

    if (otpPurpose === "verify-acct" && userAuth.isVerified) {
      return handleResponse({
        res,
        status: 400,
        message: "this account has been verified",
      });
    }
    const verificationCode = userAuth.randomOTP();

    await new OtpModel({
      User: user._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: otpPurpose,
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
    return handleResponse({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
}

export default resendOtp;
