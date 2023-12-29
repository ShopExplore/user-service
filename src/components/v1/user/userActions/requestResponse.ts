import { Response } from "express";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { requestResponseSchema } from "../user.policies";
import { z } from "zod";
import { RequestModel } from "../models/supplier-request";

async function requestResponse(req: IRequest, res: Response) {
  const { userId, response }: z.infer<typeof requestResponseSchema> = req.body;
  try {
    const request = await RequestModel.findOne({ User: userId });

    if (response === "granted") {
      request.status = response;
    }

    if (response === "declined") {
      request.status = response;
    }

    await request.save();

    //send a response mail to the user
    return handleResponse({
      res,
      message: "success",
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

export default requestResponse;
