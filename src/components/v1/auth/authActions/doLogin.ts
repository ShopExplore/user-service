import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import {
  failedLoginDelayTime,
  handleResponse,
} from "../../../../utils/response";
import { loginSchema } from "../auth.policies";
import UserModel from "../../user/user.model";
import AuthModel from "../auth.model";

async function doLogin(req: IRequest, res: Response) {
  const { email, password }: z.infer<typeof loginSchema> = req.body;

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

    if (!userAuth.isVerified) {
      return handleResponse({
        res,
        status: 400,
        message: "account is not verified",
      });
    }
    const { allowedLoginAttempt, msBeforeNext } = failedLoginDelayTime(
      userAuth.lastLoginAt,
      userAuth.failedLoginAttempts
    );

    if (
      userAuth.failedLoginAttempts > allowedLoginAttempt &&
      msBeforeNext > 0
    ) {
      const waitMinutes = msBeforeNext / (60 * 1000);
      return handleResponse({
        res,
        status: 400,
        message: `Too many failed login attempts. Please wait for ${waitMinutes} minutes and try again.`,
      });
    }

    if (!userAuth.comparePassword(password)) {
      userAuth.failedLoginAttempts = +1;
      await userAuth.save();

      return handleResponse({
        res,
        message: "Invalid login credentials",
        status: 401,
      });
    } else {
      userAuth.failedLoginAttempts = 0;
      userAuth.lastLoginAt = new Date(Date.now());
    }

    const token = userAuth.generateToken({
      data: {
        ref: existingUser._id,
        role: existingUser.role,
      },
    });

    return handleResponse({
      res,
      message: "Login successful, Welcome 🤗",
      data: {
        token,
        profile: existingUser,
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

export default doLogin;
