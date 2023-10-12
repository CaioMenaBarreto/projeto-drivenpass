import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { unauthorizedError } from '@/errors';
import { userRepository } from '@/repositories';

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) throw unauthorizedError();

  const token = authHeader.split(' ')[1];
  if (!token) throw unauthorizedError();

  const { userId } = jwt.verify(token, process.env.JWT_SECRET) as UserId;

  const session = await userRepository.findSession(token);
  if (!session) throw unauthorizedError();

  req.userId = userId;
  next();
}

export type AuthenticatedRequest = Request & UserId;

type UserId = {
  userId: number;
};
