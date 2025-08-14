import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Auth
export const signin = (data) => API.post("/auth/signin", data);
export const signup = (data) => API.post("/auth/signup", data);

// Posts
export const getPosts = () => API.get("/posts");
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post("/posts", data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const updatePost = (id, data) => API.patch(`/posts/${id}`, data);

// Users
export const searchUsers = (query) => API.get(`/u/search/${query}`);
export const getUser = (username) => API.get(`/u/${username}`);
export const updateUser = (username, formData) =>
  API.patch(`/u/${username}`, formData);

// Likes
export const toggleLikeApi = (id) => API.post(`/posts/${id}/like`);

// Comments
export const getComments = (id) => API.get(`posts/${id}/comments`);
export const postComment = (id, text) =>
  API.post(`posts/${id}/comments`, { text });
