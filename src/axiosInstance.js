import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000" 
      : "https://boomentertainment-backend.onrender.com",
  withCredentials: true,
});

export default instance;
