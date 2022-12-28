import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../natsWrapper";

it("returns an error if ticket does not exist", async () => {

});

it("returns an error if ticket is already reserved", async () => {
  // const response = await request(app).post("/api/tickets").send({});
  // expect(response.status).not.toEqual(404);
});

it("reserves a ticket", async () => {
  // const response = await request(app).post("/api/tickets").send({});
  // expect(response.status).not.toEqual(404);
});
