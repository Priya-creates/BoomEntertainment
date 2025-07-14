import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000" 
      : "https://refreshing-communication-production.up.railway.app/",
  withCredentials: true,
});

export default instance;
