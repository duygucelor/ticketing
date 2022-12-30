import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@tixcuborg/common";
import { queueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/orderCanceledPublisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();
    await new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
