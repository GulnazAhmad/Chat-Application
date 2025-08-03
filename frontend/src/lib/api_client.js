//An api_client.js file is typically used to centralize and standardize all HTTP API requests in a project — usually using libraries like axios or fetch.
import axios from "axios";
import { HOST } from "../../util/constant.js";
export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // ✅ allow sending cookies
});
