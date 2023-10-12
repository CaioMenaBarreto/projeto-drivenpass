import { ApplicationError } from "@/protocols";

export function userExists(): ApplicationError {
    return {
        name: "DuplicatedEmailError",
        message: "This user already exists."
    }
}

export function NotFound(): ApplicationError {
    return {
        name: "NotFoundError",
        message: "This user don't exists."
    }
}

export function invalidCredentialsError(): ApplicationError {
    return {
        name: 'InvalidCredentialsError',
        message: 'email or password are incorrect',
    };
}

export function unauthorizedError(): ApplicationError {
    return {
        name: 'UnauthorizedError',
        message: 'You must be signed in to continue',
    };
}
