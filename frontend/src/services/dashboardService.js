import axios from "axios";

const API_URL = "/api/dashboard";

export const getStats = () => axios.get(`${API_URL}/stats`);
export const getChart = () => axios.get(`${API_URL}/chart`);
export const getNotifKritis = () => axios.get(`${API_URL}/notif-kritis`);
export const getRecentRequests = () => axios.get(`${API_URL}/recent-requests`);
