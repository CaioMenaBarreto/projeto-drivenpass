import { userRepository } from "../repositories/index";
import { NotFound, invalidCredentialsError, userExists } from "../errors/index";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function signUpService(email: string, password: string) {
    const userExist = await userRepository.verifyUser(email);
    if (userExist) throw userExists();

    const hash = bcrypt.hashSync(password, 10);

    const user = await userRepository.createUser(email, hash);
    return user;
}
export async function signInService(email: string, password: string) {
    const user = await userRepository.verifyUser(email);
    if (!user) throw NotFound();

    await validatePasswordOrFail(password, user.password);

    const token = await createSession(user.id);
    return token;
}

async function createSession(userId: number) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    await userRepository.createSession(
        token,
        userId
    );

    return token;
}

export async function validatePasswordOrFail(password: string, userPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) throw invalidCredentialsError();
}