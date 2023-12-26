import { Response } from "express";
import { z } from "zod";

import { handleResponse } from "../../../../utils/response";
import { InviteModel } from "../../user/user.model";
import { getInviteSchema } from "../user.policies";
import { IRequest } from "../../../../utils/types";

async function getInvite(req: IRequest, res: Response) {
  const { id }: z.infer<typeof getInviteSchema> = req.body;

  try {
    if (!req.query || !id) {
      const invites = await InviteModel.find();

      return handleResponse({
        res,
        message: "successful",
        data: invites,
      });
    }

    const invite = await InviteModel.findById(id);
    if (!invite) {
      return handleResponse({
        res,
        status: 400,
        data: invite,
      });
    }

    return handleResponse({
      res,
      message: "successful",
      data: invite,
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

export default getInvite;
