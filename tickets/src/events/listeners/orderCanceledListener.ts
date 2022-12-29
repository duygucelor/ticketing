import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent, OrderCanceledEvent } from "@tixcuborg/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const { ticket } = data;
    const canceledTicket = await Ticket.findById(ticket.id);

    if (!canceledTicket) {
      throw new Error("Ticket not found");
    }

    canceledTicket.set({ orderId: undefined });
    await canceledTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: canceledTicket.id,
      version: canceledTicket.version,
      title: canceledTicket.title,
      price: canceledTicket.price,
      userId: canceledTicket.userId,
      orderId: canceledTicket.orderId
    });

    msg.ack();
  }
}
