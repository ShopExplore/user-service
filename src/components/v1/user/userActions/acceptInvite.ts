import { Response } from "express";
import { startSession } from "mongoose";
import { z } from "zod";

import {
  abortSessionWithResponse,
  commitSessionWithResponse,
} from "../../../../utils/response";
import UserModel, { InviteModel } from "../../user/user.model";
import { acceptInviteSchema } from "../user.policies";
import { IRequest } from "../../../../utils/types";
import AuthModel from "../../auth/auth.model";

async function acceptInvite(req: IRequest, res: Response) {
  const {
    code,
    userName,
    email,
    password,
  }: z.infer<typeof acceptInviteSchema> = req.body;

  const session = await startSession();
  session.startTransaction();

  try {
    const invite = await InviteModel.findOne({
      code,
      email,
      status: "pending",
    }).session(session);
    if (!invite) {
      return abortSessionWithResponse({
        res,
        session,
        status: 400,
        message:
          "You don't have a pending invite, contact support for invitation",
      });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return abortSessionWithResponse({
        res,
        session,
        message: "This account already exists, please login instead",
        status: 400,
      });
    }

    const user = await new UserModel({
      userName,
      email,
      role: invite.role,
    }).save({ session });

    await new AuthModel({
      User: user._id,
      password,
      isVerified: true,
    }).save({ session });

    invite.status = "accepted";
    await invite.save({ session });
    return commitSessionWithResponse({
      res,
      session,
      message: "user created successfully, pls login",
      data: user,
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

export default acceptInvite;
