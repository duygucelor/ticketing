import { OrderStatus } from "@tixcuborg/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../natsWrapper";

it("returns an error if ticket does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: new mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Stromae",
    price: 100,
  });
  await ticket.save();

  const order = Order.build({
    userId: "qzfzfe",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "Stromae",
    price: 100,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("publishes an event", async () => {
  let orders = await Order.find({});
  expect(orders.length).toEqual(0);
  const ticket = Ticket.build({
    title: "Stromae",
    price: 100,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  orders = await Order.find({});

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});