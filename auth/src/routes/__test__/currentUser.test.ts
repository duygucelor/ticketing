import request from "supertest";
import { app } from "../../app";

it("It gets currentUser", async () => {
  const auth = await request(app)
    .post("/api/users/signUp")
    .send({
      email: "test@test.com",
      password: "test1234",
    })
    .expect(201);

  const cookie = auth.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
