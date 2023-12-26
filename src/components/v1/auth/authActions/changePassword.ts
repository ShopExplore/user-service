import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { changePasswordSchema } from "../auth.policies";
import UserModel from "../../user/user.model";
import AuthModel from "../auth.model";

async function changePassword(req: IRequest, res: Response) {
  const {
    oldPassword,
    newPassword,
    confirmPassword,
  }: z.infer<typeof changePasswordSchema> = req.body;

  const { _id } = req.user;
  try {
    const user = await UserModel.findById(_id);
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

    if (!userAuth.comparePassword(oldPassword)) {
      return handleResponse({
        res,
        message: "incorrect password",
        status: 400,
      });
    }

    if (newPassword === confirmPassword) {
      return handleResponse({
        res,
        status: 400,
        message: "password do not match",
      });
    }

    userAuth.password = confirmPassword;
    await userAuth.save();

    return handleResponse({
      res,
      message: "success",
    });
  } catch (err) {
    return handleResponse({
      res,
      message: "Internal server error",
      status: 500,
    });
  }
}

export default changePassword;
