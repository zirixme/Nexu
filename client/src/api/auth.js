import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const signin = (data) => API.post("/auth/signin", data);
export const signup = (data) => API.post("/auth/signup", data);
