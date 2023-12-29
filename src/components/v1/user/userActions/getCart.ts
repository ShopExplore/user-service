import { Response } from "express";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { CartModel } from "../models/cart.model";

async function getCart(req: IRequest, res: Response) {
  const { _id } = req.user;
  try {
    const cart = await CartModel.findOne({ User: _id });

    return handleResponse({
      res,
      data: cart,
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

export default getCart;
