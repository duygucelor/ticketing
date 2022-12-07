import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,checkCurrentUser } from "@tixcuborg/common";
import { createTicketRouter } from "./routes/createTicket";
import { getTicketRouter } from "./routes/getTicket";

const app = express();
app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(checkCurrentUser)

app.use(createTicketRouter)
app.use(getTicketRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
