import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { getRequestSchema } from "../user.policies";
import { RequestModel } from "../models/supplier-request";

async function getRequest(req: IRequest, res: Response) {
  const { requestId }: z.infer<typeof getRequestSchema> = req.query;
  try {
    let requests;

    requestId
      ? (requests = await RequestModel.findOne({ _id: requestId }))
      : (requests = await RequestModel.find());

    return handleResponse({
      res,
      message: "success",
      data: requests,
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

export default getRequest;
