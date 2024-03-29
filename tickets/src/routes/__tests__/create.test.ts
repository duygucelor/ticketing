import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../natsWrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("if the use is signed in , error code is not 401", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ price: 10 })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert" })
    .expect(400);
});

it("creates a ticket successfully", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert", price: 40 })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
});

it("publishes an event", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert", price: 40 })
    .expect(201);

  tickets = await Ticket.find({});

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});