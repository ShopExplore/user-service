import { Request, Response } from "express";
import { IUser } from "../components/v2/user/user.types";
import { ClientSession, Types } from "mongoose";
import { IAuth } from "../components/v2/auth/auth.types";

export interface IRequest extends Request {
  user?: IUser;
  decoded?: IToken;
  role?: string;
  userAuth: IAuth;
}

export interface IToken {
  ref: Types.ObjectId;
  role: string;
}

export type handleResponseArgType = {
  res: Response;
  data?: any;
  status?: number;
  err?: any;
  message?: string;
};

export type handleSessionResArgType = {
  res: Response;
  session: ClientSession;
  data?: any;
  status?: number;
  err?: any;
  message?: string;
};
