import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsWrapper";
import { TicketCreatedListener } from "./events/listeners/ticketCreatedListener";
import { TicketUpdatedListener } from "./events/listeners/ticketUpdatedListener";
import { ExpirationCompleteListener } from "./events/listeners/expirationCompleteListener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT token must be defined!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined!");
  }
  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI must be defined!");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined!");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined!");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    mongoose.set("strictQuery", true);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
