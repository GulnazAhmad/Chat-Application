//all the constants that are used again and again
export const HOST = import.meta.env.VITE_BACKEND_SERVER_URL;
export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const PROFILE_ROUTE = `${AUTH_ROUTES}/profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;

export const SEARCH_CONTACTS_ROUTES = `api/searchcontact`;

export const MESSAGES_ROUTE = "/api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;

export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/upload-file`;
