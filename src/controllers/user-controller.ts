import { Request, Response } from "express";
import { signUpService } from "../services/index";
import httpStatus from "http-status";

async function signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await signUpService(email, password);
    console.log(user)
    res.sendStatus(httpStatus.CREATED);
}

export const userController = {
    signUp
}