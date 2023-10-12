import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { userRouter, credentialRouter } from './routers';
import { handleApplicationErrors } from './middlewares';
import { connectDb, disconnectDB } from './config';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app
    .use(cors())
    .use(express.json())
    .get('/health', (_req, res) => res.send('OK!'))
    .use('/users', userRouter)
    .use('/credentials', credentialRouter)
    .use(handleApplicationErrors);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;
