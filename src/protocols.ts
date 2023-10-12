import { User } from '@prisma/client';

export type ApplicationError = {
  name: string;
  message: string;
};
export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type NewCredential = {
  userId:  number,
  title:   String,
  url:      String,
  username: String,
  password: String
}

export type NewUser = Omit<User, "id" | "Credential">