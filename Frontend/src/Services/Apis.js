import { BaseURL } from "../../appsettings.js";

export const userEndpoints = {
    LOGIN_API: BaseURL + "auth/login",
    REGISTER_API: BaseURL + "auth/register",
    VALIDATE_GMAIL: BaseURL + "auth/authenticateMail",
}
export const workFlowEndpoints = {
    CREATE_WF: BaseURL + "workflow/create",
    FETCH_NODES: BaseURL + "workflow/fetch-nodes",
    FETCH_LAST_WF_ID: BaseURL + "workflow/lastWorkflowId",
    FETCH_WF_LIST: BaseURL + "workflow/wfList",
    FETCH_WF_DETAILS: BaseURL + "workflow/wfDetails/",
}