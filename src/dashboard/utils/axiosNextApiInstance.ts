import axios from "axios";

/**
 * Axios instance calling Next.js server API
 */
export const axiosNextApiInstance = axios.create({
  baseURL: "http://localhost:3030/",
  timeout: 1000,
});