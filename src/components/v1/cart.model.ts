import { Document, Types } from "mongoose";

interface ICart extends Document {
  userId: Types.ObjectId;
  products?: Array<Types.ObjectId>;
  items: [
    {
      product?: Array<Types.ObjectId>;
      quantity: number,
      
    }
  ];
}