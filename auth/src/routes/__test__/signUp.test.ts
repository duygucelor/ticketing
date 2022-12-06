import request from "supertest";
import { app } from "../../app";

it("return 201 with successful sign up", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(201);
});

it("return 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test",
      password: "test1234",
    })
    .expect(400);
});

it("return 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "tes",
    })
    .expect(400);
});

it("return 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signUp")
    .send({
      email: "tessfsqt@test.com",
      password: "teseteteterteteetzqwdfxjhgkhkgfddfhgjhhgfdsdfg",
    })
    .expect(400);
});

it("return 400 with duplicated email", async () => {
  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signUp")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  
    expect(response.get("Set-Cookie")).toBeDefined();
  });