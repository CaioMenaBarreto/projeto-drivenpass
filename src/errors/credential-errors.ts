import { ApplicationError } from "@/protocols";

export function credentialExists(): ApplicationError{
    return {
        name: "credentialExists",
        message: "This credential already exists."
    }
}

export function credentialNotExists(): ApplicationError{
    return {
        name: "credentialNotExists",
        message: "This credential doesn't exist or is not yours."
    }
}