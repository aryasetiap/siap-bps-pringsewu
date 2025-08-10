import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const user = localStorage.getItem("username");

    setIsAuthenticated(!!token);
    setUserRole(role);
    setUsername(user);
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  const getHomePage = () => {
    if (!isAuthenticated) return "/login";
    return userRole === "admin" ? "/admin/dashboard" : "/pegawai/permintaan";
  };

  return { isAuthenticated, userRole, username, loading, logout, getHomePage };
}
