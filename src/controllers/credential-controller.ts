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

async function getAllCredentials(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const credentials = await credentialService.getAllCredentials(userId);
    res.status(httpStatus.OK).send(credentials);
}
async function getCredentialById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { id } = req.params;
    const credentialId = Number(id);
    const credential = await credentialService.getCredentialById(userId, credentialId);
    res.status(httpStatus.OK).send(credential);
}

async function deleteCredential(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const { id } = req.params;
    const credentialId = Number(id);

    await credentialService.deleteCredential(userId, credentialId);
    res.sendStatus(httpStatus.ACCEPTED);
}

export const credentialController = {
    createCredentials,
    getAllCredentials,
    getCredentialById,
    deleteCredential
}