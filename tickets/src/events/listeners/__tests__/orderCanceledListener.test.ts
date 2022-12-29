import { Message, Stan } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../__mocks__/natsWrapper";
import { OrderCreatedListener } from "../orderCreatedListener";
import { OrderCanceledEvent, OrderCreatedEvent, OrderStatus } from "@tixcuborg/common";
import { OrderCanceledListener } from "../orderCanceledListener";

const setup = async () => {
  const listener = new OrderCanceledListener(
    natsWrapper.client as unknown as Stan
  );

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const data: OrderCanceledEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("cancels a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.ticket.id);

  expect(ticket).toBeDefined();
  expect(ticket!.orderId).toEqual(undefined);
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
  const ticket = await Ticket.findById(data.ticket.id);



  expect(ticket!.orderId).not.toBeDefined();
});
