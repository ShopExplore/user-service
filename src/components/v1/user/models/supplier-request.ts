import { Document, Schema, Types, model } from "mongoose";
import platformConstants from "../../../../configs/platfromContants";

export interface IRequest extends Document {
  User: Types.ObjectId;
  status: (typeof platformConstants.requestStatus)[number];
}

const requestSchema = new Schema<IRequest>({
  User: Schema.Types.ObjectId,
  status: {
    type: String,
    enum: platformConstants.requestStatus,
    default: "pending",
  },
});

export const RequestModel = model<IRequest>("Request", requestSchema);
