import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@tixcuborg/common";
import { Order } from "../models/order";
import { OrderCanceledPublisher } from "../events/publishers/orderCanceledPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Canceled;
    await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      version:order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
