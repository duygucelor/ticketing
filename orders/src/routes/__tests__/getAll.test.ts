import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const title = "concert";
  const price = 40;
  const id = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({ id, title, price });
  await ticket.save();

  return ticket;
};

it("fetch tickets", async () => {
  const firstTicket = await createTicket();
  const secondTicket = await createTicket();
  const thirdTicket = await createTicket();

  const firstUser = global.signin();
  const secondUser = global.signin();
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  const { body: secondOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: secondTicket.id })
    .expect(201);

  const { body: thirdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: thirdTicket.id })
    .expect(201);

  const ticketsResponse = await request(app)
    .get("/api/orders")
    .set("Cookie", secondUser)
    .send()
    .expect(200);

  expect(ticketsResponse.body.length).toEqual(2);
  expect(ticketsResponse.body[0].id).toEqual(secondOrder.id);
  expect(ticketsResponse.body[1].id).toEqual(thirdOrder.id);
});
