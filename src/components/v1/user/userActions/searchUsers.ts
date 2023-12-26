import { Response } from "express";
import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import UserModel from "../user.model";
import { z } from "zod";
import { searchSchema } from "../user.policies";

async function searchUsers(req: IRequest, res: Response) {
  const { search_query }: z.infer<typeof searchSchema> = req.query;
  const { _id } = req.user;
  try {
    const users = await UserModel.find({
      $text: { $search: search_query },
      _id: { $ne: _id },
    }).lean();

    console.log(users);
    handleResponse({
      res,
      message: "successful",
      data: users,
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

export default searchUsers;
