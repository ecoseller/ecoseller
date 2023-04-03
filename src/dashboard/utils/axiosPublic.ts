// /common/axiosPublic.js
import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL, //"http://backend:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});
