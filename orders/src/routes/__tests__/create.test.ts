import { OrderStatus } from "@tixcuborg/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("returns an error if ticket does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: new mongoose.Types.ObjectId() })
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
  // const response = await request(app).post("/api/tickets").send({});
  // expect(response.status).not.toEqual(404);
});
