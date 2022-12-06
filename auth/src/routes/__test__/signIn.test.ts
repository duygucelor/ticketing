import request from "supertest";
import { app } from "../../app";

it("It fails if the user does not exist", async () => {
  await request(app)
    .post("/api/users/signIn")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(400);
});

it("It sets a cookie after signin", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signIn")
    .send({
      email: "test@test.com",
      password: "test123456",
    })
    .expect(400);
});

it("It sets a cookie after signIn", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signIn")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
