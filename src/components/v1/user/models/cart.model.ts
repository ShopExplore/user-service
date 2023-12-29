import { Document, Types, Schema, model } from "mongoose";

export interface ICart extends Document {
  User: Types.ObjectId;
  items?: [
    {
      product: Array<Types.ObjectId>;
      quantity: number;
    }
  ];
  totalFee: number;
}

const cartSchema = new Schema<ICart>({
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  totalFee: Number,
});

export const CartModel = model<ICart>("Cart", cartSchema);
