// /common/axiosPublic.js
import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
        "Content-Type": "application/json",
    },
});