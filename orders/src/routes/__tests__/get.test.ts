import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const title = "concert";
  const price = 40;
  const id =new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({ id,title, price });
  await ticket.save();

  return ticket;
};

it("get an order by id", async () => {
  const firstTicket = await createTicket();

  const firstUser = global.signin();
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

    const { body: order } = await request(app)
    .get(`/api/orders/${firstOrder.id}`)
    .set("Cookie", firstUser)
    .expect(200);

    expect(order.id).toEqual(firstOrder.id);
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
    .get(`/api/orders/${firstOrder.id}`)
    .set("Cookie", secondUser)
    .expect(401);
});

it("returns 404 if there is no order", async () => {
  const firstUser = global.signin();
  const id = mongoose.Types.ObjectId;
  await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", firstUser)
    .expect(404);
});
