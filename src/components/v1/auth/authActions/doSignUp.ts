import { Response } from "express";
import { startSession } from "mongoose";
import { z } from "zod";

import {
  abortSessionWithResponse,
  commitSessionWithResponse,
  handleResponse,
} from "../../../../utils/response";
import UserModel from "../../user/user.model";
import { signUpSchema } from "../auth.policies";
import platformConstants from "../../../../configs/platfromContants";
import AuthModel, { OtpModel } from "../auth.model";
import { IRequest } from "../../../../utils/types";
import { _omit } from "../../../../utils/customLibrary";

async function doSignUp(req: IRequest, res: Response) {
  const { userName, email, password }: z.infer<typeof signUpSchema> = req.body;

  const session = await startSession();
  session.startTransaction();

  try {
    const existingUser = await UserModel.findOne({
      email,
    }).session(session);

    if (existingUser) {
      return abortSessionWithResponse({
        res,
        message: "Account already exists, Login instead please",
        status: 409,
        session,
      });
    }

    const newUser = await new UserModel({
      userName,
      email,
      role: platformConstants.role[0],
    }).save({ session });

    const userAuth = await new AuthModel({
      User: newUser._id,
      password,
      isVerified: false,
    }).save({ session });

    const verificationCode = userAuth.randomOTP();

    await new OtpModel({
      User: newUser._id,
      code: verificationCode,
      expireAt: new Date(Date.now() + 1000 * 60 * 30),
      purpose: "verify-acct",
      isVerified: false,
    }).save({ session });

    //send a mail
    console.log("new user verification:  ", verificationCode);

    return commitSessionWithResponse({
      res,
      session,
      message: "verification code has been sent to your mail",
      data: {
        accountVerificationComplete: false,
      },
    });
  } catch (err) {
    abortSessionWithResponse({
      res,
      session,
      err,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export default doSignUp;
