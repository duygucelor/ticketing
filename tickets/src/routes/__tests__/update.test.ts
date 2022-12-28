import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../natsWrapper";

it("i can update a ticket created by me with valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 40 })
    .expect(201);

  const title = "Concert Coldplay";
  const price = 400;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie",cookie)
    .send()
    
  expect(ticket.body.title).toEqual(title);
  expect(ticket.body.price).toEqual(price);
});

it("it returns 401, if the user is not authenticated", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert", price: 40 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({ title: "concert 5", price: 50 })
    .expect(401);
});

it("it returns 401, if the ticket is not created by the authenticated user", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert", price: 40 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({ title: "concert 5", price: 50 })
    .expect(401);
});

it("it returns 400, if the user provides invalid ticket parameters", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 40 })
    .expect(201);

  const title = "";
  const price = 40;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(400);
});

it("it returns 400, if the user provides invalid ticket parameters", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 40 })
    .expect(201);

  const title = "Concert";
  const price = -20;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(400);
});

it("t returns 404 if the ticket does not exist", async () => {
  const title = "concert";
  const price = 40;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title, price })
    .expect(404);
});

it("publishes an evenwt", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "concert", price: 40 })
    .expect(201);

  const title = "Concert Coldplay";
  const price = 400;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});