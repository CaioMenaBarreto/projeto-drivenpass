import { userRepository } from "../repositories/index";
import { userExists } from "../errors/index";

export async function signUpService(email: string, password: string){
    const userExist = await userRepository.verifyUser(email);
    if(userExist) throw userExists();

    const user = await userRepository.createUser(email, password);
    return user;
}