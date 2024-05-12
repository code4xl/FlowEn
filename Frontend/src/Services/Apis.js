import { BaseURL } from "../../appsettings.js";

export const userEndpoints = {
    LOGIN_API: BaseURL + "auth/login",
    REGISTER_API: BaseURL + "auth/register",
    VALIDATE_GMAIL: BaseURL + "auth/authenticateMail",
}