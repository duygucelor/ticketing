import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/orders",
  async (req: Request, res: Response) => {
    // const tickets = await Ticket.find({});
    // res.send(tickets);
  }
);

export { router as getAllOrdersRouter };
