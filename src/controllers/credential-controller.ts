import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares/authentication-middleware";
import { credentialService } from "@/services";

async function createCredentials(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { title, url, username, password } = req.body;
    const credential = await credentialService.createCredentials(userId, title, url, username, password);
    res.status(httpStatus.CREATED).send(credential);
}

export const credentialController = {
    createCredentials
}