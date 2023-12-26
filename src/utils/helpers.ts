import mongoose from "mongoose";
import { ObjectId } from "bson";

export const isValidId = (id: string | number | ObjectId) =>
  id && mongoose.Types.ObjectId.isValid(id);
