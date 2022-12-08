import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("get a ticket by id", async () => {
  const title = "concert";
  const price = 40;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});

it("If there is no ticket, returns 404", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send()
    .expect(404);
});
