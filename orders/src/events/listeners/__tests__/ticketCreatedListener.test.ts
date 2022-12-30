import { Message, Stan } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { TicketCreatedEvent } from "@tixcuborg/common";
import { TicketCreatedListener } from "../ticketCreatedListener";
import { natsWrapper } from "../../../__mocks__/natsWrapper";

const setup = async () => {
  const listener = new TicketCreatedListener(
    natsWrapper.client as unknown as Stan
  );

  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
