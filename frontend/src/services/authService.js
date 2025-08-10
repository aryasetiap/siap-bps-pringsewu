import api from "./api";

/**
 * Service untuk autentikasi dan manajemen user
 */

// Login user dan dapatkan token & info
export const login = (credentials) => api.post("/auth/login", credentials);

// Logout user (invalidasi token di server)
export const logout = () => api.post("/auth/logout");

// Verifikasi token masih valid
export const verifyToken = () => api.get("/auth/verify");

// Ambil data user yang sedang login
export const getCurrentUser = () => api.get("/auth/me");
