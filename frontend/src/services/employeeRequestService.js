import axios from "axios";

const API_URL = "/api/permintaan";

export const createPermintaan = (data) => axios.post(API_URL, data);
