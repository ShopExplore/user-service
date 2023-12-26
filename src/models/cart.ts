import { Document, Types, Schema, model } from "mongoose";

export interface ICart extends Document {
  product: Types.ObjectId[];
  user: Types.ObjectId;
  unit: number;
}

const cartSchema = new Schema<ICart>(
  {
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
    unit: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const CartModel = model<ICart>("Cart", cartSchema);

export interface IWishlist extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const WishlistModel = model<IWishlist>("Wishlist", wishlistSchema);
