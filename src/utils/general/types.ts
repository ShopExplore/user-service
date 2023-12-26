import { Request } from "express";
import { IUser } from "../../components/v1/user/user.types";
import { Types } from "mongoose";
import { IAuth } from "../../components/v1/auth/auth.types";

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
