import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,checkCurrentUser } from "@tixcuborg/common";
import { createTicketRouter } from "./routes/create";
import { getTicketByIdRouter } from "./routes/get";
import {getAllTicketsRouter} from "./routes/getAll"
import {updateTicketRouter} from './routes/update'

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
app.use(getTicketByIdRouter)
app.use(getAllTicketsRouter)
app.use(updateTicketRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
