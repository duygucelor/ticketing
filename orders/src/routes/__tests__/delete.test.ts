import { OrderStatus } from "@tixcuborg/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../natsWrapper";

const createTicket = async () => {
  const title = "concert";
  const price = 40;

  const ticket = Ticket.build({ title, price });
  await ticket.save();

  return ticket;
};

it("delete an order by id", async () => {
  const firstTicket = await createTicket();

  const firstUser = global.signin();
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${firstOrder.id}`)
    .set("Cookie", firstUser)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(firstOrder.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Calceled);
});

it("returns 401 if it is not signedIn users order", async () => {
  const firstTicket = await createTicket();

  const firstUser = global.signin();
  const secondUser = global.signin();
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${firstOrder.id}`)
    .set("Cookie", secondUser)
    .expect(401);
});

it("returns 404 if there is no order", async () => {
  const firstUser = global.signin();
  const id = mongoose.Types.ObjectId;
  await request(app)
    .delete(`/api/orders/${id}`)
    .set("Cookie", firstUser)
    .expect(404);
});

it("publishes an event", async () => {
  const firstTicket = await createTicket();

  const firstUser = global.signin();
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${firstOrder.id}`)
    .set("Cookie", firstUser)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});