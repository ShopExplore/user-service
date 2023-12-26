import { Response } from "express";
import { z } from "zod";
import { ulid } from "ulidx";

import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { InviteModel } from "../user.model";
import { inviteSchema } from "../user.policies";

async function sendInvite(req: IRequest, res: Response) {
  const { role, email }: z.infer<typeof inviteSchema> = req.body;
  const { _id } = req.user;
  try {
    let invite = await InviteModel.findOne({ email, role });
    if (invite) {
      if (new Date(invite.expiresAt).getTime() > new Date().getTime()) {
        return handleResponse({
          res,
          status: 400,
          message: "This user has already been sent an invitation",
        });
      }

      if (invite.status === "accepted") {
        return handleResponse({
          res,
          message: "This user has been sent an invitation and accepted already",
        });
      }

      if (new Date(invite.expiresAt).getTime() < new Date().getTime()) {
        const now = Date.now() + 1000 * 60 * 60 * 24;
        invite.expiresAt = new Date(now);
        invite.code = ulid();

        //send an invite mail
        console.log(
          "new invite:  ",
          `${req.protocol}://${
            req.hostname.startsWith("localhost")
              ? "localhost:9087/"
              : "shopexV2.org/suppliers/invitation/"
          }${req.baseUrl.replace("users", "auth")}/${invite.code}`
        );
        await invite.save();

        return handleResponse({
          res,
          message: "new Invitation has been sent to the user's mail",
        });
      }
    }

    const now = Date.now() + 1000 * 60 * 60 * 24;
    invite = await new InviteModel({
      code: ulid(),
      role,
      email,
      invitedBy: _id,
      expiresAt: new Date(now),
      status: "pending",
    }).save();

    //send an invitation mail
    console.log(
      "new invite:  ",
      `${req.protocol}://${
        req.hostname.startsWith("localhost")
          ? "localhost:9087"
          : "shopexV2.org/suppliers/invitation"
      }${req.baseUrl.replace("users", "auth")}/${invite.code}`
    );

    return handleResponse({
      res,
      message: "an invitation has been sent to the user's mail",
    });
  } catch (err) {
    handleResponse({
      res,
      err,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export default sendInvite;
