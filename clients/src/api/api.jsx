import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/v1" });

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    // Log the error for debugging purposes
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

export default API;
