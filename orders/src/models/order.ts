import mongoose from "mongoose";
import { OrderStatus } from "@tixcuborg/common";
import { TicketDoc } from "./ticket";

interface OrderAttributes {
  userId: string;
  expiresAt: Date;
  status: OrderStatus;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  expiresAt: Date;
  status: OrderStatus;
  ticket: TicketDoc;
  // createdAt: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attributes: OrderAttributes): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };