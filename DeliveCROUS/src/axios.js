import axios from "axios";

const api = axios.create({
  baseURL: "https://projetnosql-mango-production.up.railway.app", // ton lien Railway
});

export default api;
