import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://rentaro-ynxo.onrender.com";
if (!import.meta.env.VITE_API_URL) {
  // Helpful warning during development when .env isn't loaded
  // eslint-disable-next-line no-console
  console.warn("VITE_API_URL not set — falling back to https://rentaro-ynxo.onrender.com");
}

const API = axios.create({
  baseURL,
});

export default API;
