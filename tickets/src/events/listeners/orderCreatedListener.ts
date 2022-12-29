import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@tixcuborg/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, ticket } = data;
    const reservedTicket = await Ticket.findById(ticket.id);

    if (!reservedTicket) {
      throw new Error("Ticket not found");
    }

    reservedTicket.set({ orderId: id });
    await reservedTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: reservedTicket.id,
      version: reservedTicket.version,
      title: reservedTicket.title,
      price: reservedTicket.price,
      userId: reservedTicket.userId,
      orderId:reservedTicket.orderId
    });

    msg.ack();
  }
}
