import axios from "axios";
import { getAccessToken, setAccessToken } from "./authToken.js";
export const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      document.cookie.includes("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const res = await API.get("/auth/refresh");
        setAccessToken(res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return API(originalRequest);
      } catch {
        // refresh failed → clear token
        setAccessToken(null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const signin = (data) => API.post("/auth/signin", data);
export const signup = (data) => API.post("/auth/signup", data);
export const signout = () => API.post("/auth/signout");
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

// Messages
export const getConversations = (id) => API.get(`/messages/${id}`);
export const GetChatUsers = () => API.get("/messages");
