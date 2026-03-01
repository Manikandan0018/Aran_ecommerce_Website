import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  // 1. Get the full string from localStorage
  const storageData = localStorage.getItem("userInfo");

  if (storageData) {
    // 2. Parse the JSON string into an object
    const parsedData = JSON.parse(storageData);

    // 3. Extract the token property (as seen in your screenshot)
    const token = parsedData.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
