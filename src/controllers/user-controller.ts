import { Request, Response } from "express";
import { signInService, signUpService } from "../services/index";
import httpStatus from "http-status";

async function signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await signUpService(email, password);
    res.sendStatus(httpStatus.CREATED);
}

async function signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await signInService(email, password);
    res.send(token).status(httpStatus.OK);
}

export const userController = {
    signUp,
    signIn
}