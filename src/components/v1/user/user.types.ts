import { Document, Types } from "mongoose";
import platformConstants from "../../../configs/platfromContants";

export interface IUser extends Document {
  userName: string;
  role: (typeof platformConstants.role)[number];
  email: string;
  avatar?: string;
}

type userRoleType = (typeof platformConstants.role)[number];
export interface IUserInvite extends Document {
  code: string;
  role: Exclude<userRoleType, "user" | "admin">;
  email: string;
  invitedBy: Types.ObjectId;
  expiresAt?: Date;
  status: (typeof platformConstants.userInviteStatus)[number];
}
