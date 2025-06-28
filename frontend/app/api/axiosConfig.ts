import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://grouper-7dn9.onrender.com",
  withCredentials: true,
});

export default apiClient;
