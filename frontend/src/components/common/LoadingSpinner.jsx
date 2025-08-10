import React from "react";

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variants = {
  primary: "border-blue-600",
  white: "border-white",
  gray: "border-gray-600",
};

/**
 * Komponen loading spinner yang dapat digunakan di berbagai tempat
 * @param {string} size - Ukuran spinner (sm, md, lg, xl)
 * @param {string} variant - Variant warna (primary, white, gray)
 * @param {string} className - Kelas tambahan (optional)
 * @param {string} text - Teks yang ditampilkan di bawah spinner (optional)
 */
const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className = "",
  text,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 ${sizes[size]} ${variants[variant]}`}
      ></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
