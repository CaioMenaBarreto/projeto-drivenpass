import { ApplicationError } from "@/protocols";

export function userExists(): ApplicationError {
    return {
        name: "DuplicatedEmailError",
        message: "This user alredy exists"
    }
}