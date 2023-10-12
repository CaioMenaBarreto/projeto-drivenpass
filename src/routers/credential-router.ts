import { credentialController } from "@/controllers";
import { authenticateToken } from "@/middlewares/authentication-middleware";
import { validateBody } from "@/middlewares/validation-middleware";
import { credentialSchema } from "@/schemas";
import { Router } from "express";

export const credentialRouter = Router();


credentialRouter.all('/*', authenticateToken);
credentialRouter.post('/create', validateBody(credentialSchema), credentialController.createCredentials);