import { ApplicationError } from "@/protocols";

export function credentialExists(): ApplicationError{
    return {
        name: "credentialExists",
        message: "This credential already exists."
    }
}