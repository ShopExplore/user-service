import { Response } from "express";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { RequestModel } from "../models/supplier-request";
import UserModel from "../user.model";

async function supplierRequest(req: IRequest, res: Response) {
  const { _id } = req.user;
  try {
    // const admin = await UserModel.findOne({ role: "admin" });
    await new RequestModel({ User: _id }).save();

    //send a mail to the admin asking to become a supplier

    return handleResponse({
      res,
      message: "request is has been sent, kindly wait for approval",
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

export default supplierRequest;

//send a mail to admin asking to become a supplier
//if granted, update user status to "supplier" and send the user a mail that thy have become suplier
//else send a mail to the user that their request to become a supplier has been rejected
