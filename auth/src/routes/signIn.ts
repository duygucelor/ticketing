import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/badRequestError";
import { validateRequest } from "../middlewares/requestValidation";
import { User } from "../models/user";
import { Password } from "../utils.ts/password";

const router = express.Router();

router.post(
  "/api/users/signIn",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must be supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("USER_NOT_FOUND");
    }
    const isPasswordCorrect = await Password.compare(
      existingUser.password,
      password
    );
    if (!isPasswordCorrect) {
      throw new BadRequestError("INVALID_PASSWORD");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };
    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
