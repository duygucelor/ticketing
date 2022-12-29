import { Message, Stan } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../__mocks__/natsWrapper";
import { OrderCreatedListener } from "../orderCreatedListener";
import { OrderCreatedEvent, OrderStatus } from "@tixcuborg/common";

const setup = async () => {
  const listener = new OrderCreatedListener(
    natsWrapper.client as unknown as Stan
  );

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: ticket.userId,
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("reserves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.ticket.id);

  expect(ticket).toBeDefined();
  expect(ticket!.orderId).toEqual(data.id);
  expect(ticket!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes ticketUpdated event", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedTicket = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(updatedTicket.orderId);
});
