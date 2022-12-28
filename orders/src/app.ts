import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError,checkCurrentUser } from "@tixcuborg/common";
import { createOrderRouter } from "./routes/create";
import { getOrderByIdRouter } from "./routes/get";
import {getUserOrdersRouter} from "./routes/getAll"
import {deleteOrderRouter} from './routes/delete'

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

app.use(createOrderRouter)
app.use(getOrderByIdRouter)
app.use(getUserOrdersRouter)
app.use(deleteOrderRouter)

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
