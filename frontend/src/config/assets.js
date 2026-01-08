/**
 * Asset path configuration untuk environment yang berbeda
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const ASSET_PATHS = {
  IMAGES: {
    LOGO_BPS: isDevelopment
      ? "/images/logo-bps-pringsewu.png"
      : `${process.env.PUBLIC_URL}/images/logo-bps-pringsewu.png`,
    DASHBOARD_ADMIN: isDevelopment
      ? "/images/dashboard-admin.png"
      : `${process.env.PUBLIC_URL}/images/dashboard-admin.png`,
    // Tambahkan path image lainnya
  },
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001",
};

// Helper function untuk mendapatkan asset path
export const getAssetPath = (assetKey) => {
  const keys = assetKey.split(".");
  let path = ASSET_PATHS;

  for (const key of keys) {
    path = path[key];
    if (!path) return "";
  }

  return path;
};
