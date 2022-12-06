import request from "supertest";
import { app } from "../../app";

it("It clears cookie after sign out", async () => {
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
      password: "test1234",
    })
    .expect(200);

  const response = await request(app)
    .post("/api/users/signOut")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie"));
});
