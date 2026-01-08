import React from "react";
import { getAssetPath } from "../../config/assets";

/**
 * Logo component yang menggunakan asset path yang benar
 */
const Logo = ({ className = "", alt = "BPS Pringsewu Logo" }) => {
  return (
    <img
      src={getAssetPath("IMAGES.LOGO_BPS")}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error("Failed to load logo:", e.target.src);
        e.target.style.display = "none";
      }}
    />
  );
};

export default Logo;
