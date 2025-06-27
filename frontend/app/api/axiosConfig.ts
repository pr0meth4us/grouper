import axios from "axios";

// Create a new Axios instance with default configuration
const apiClient = axios.create({
    // Sets the base URL for all requests, so you don't have to repeat it.
    // This should point to the address of your Spring Boot backend.
    baseURL: "http://localhost:8080",

    // This is the crucial setting that tells axios to send cookies
    // (like your JWT token) with every request.
    withCredentials: true,
});

export default apiClient;
