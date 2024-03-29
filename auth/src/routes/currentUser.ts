import express, { Request, Response } from "express";
import { checkCurrentUser } from "@tixcuborg/common";

const router = express.Router();

router.get(
  "/api/users/currentUser",
  checkCurrentUser,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
