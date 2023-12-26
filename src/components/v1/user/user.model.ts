import { Schema, model } from "mongoose";

import { IUser, IUserInvite } from "./user.types";
import platformConstants from "../../../configs/platfromContants";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    role: {
      type: String,
      enum: platformConstants.role,
    },
    avatar: String,
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

userSchema.index({
  userName: "text",
  email: "text",
});

const UserModel = model<IUser>("User", userSchema);
export default UserModel;

const userInviteSchema = new Schema<IUserInvite>(
  {
    code: String,
    role: String,
    email: String,
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: String,
    status: { type: String, enum: platformConstants.userInviteStatus },
  },
  { timestamps: true }
);

export const InviteModel = model<IUserInvite>("UserInvite", userInviteSchema);
