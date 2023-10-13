import { credentialController } from "../controllers/index";
import { authenticateToken } from "../middlewares/authentication-middleware";
import { validateBody } from "../middlewares/validation-middleware";
import { credentialSchema } from "../schemas/index";
import { Router } from "express";

export const credentialRouter = Router();


credentialRouter.all('/*', authenticateToken);
credentialRouter.post('/create', validateBody(credentialSchema), credentialController.createCredentials);
credentialRouter.get('/find-many', credentialController.getAllCredentials);
credentialRouter.get('/find/:id',credentialController.getCredentialById);
credentialRouter.delete("/delete/:id", credentialController.deleteCredential);