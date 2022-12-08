import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  const title = "concert";
  const price = 40;
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price })
    .expect(201);
};

it("fetch tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const ticketsResponse = await request(app).get("/api/tickets").send().expect(200);

  expect(ticketsResponse.body.length).toEqual(4);
});
