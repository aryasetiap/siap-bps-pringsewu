/**
 * File: ErrorAlert.jsx
 * Komponen alert untuk menampilkan pesan error, warning, atau info pada aplikasi SIAP.
 * Digunakan untuk memberikan feedback kepada user terkait pengelolaan barang, permintaan, dan verifikasi.
 *
 * Komponen ini mendukung fitur dismissible agar pesan dapat ditutup oleh user.
 */

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

/**
 * Variabel untuk menentukan style berdasarkan jenis alert.
 * Key: variant, Value: class Tailwind CSS.
 */
const ALERT_VARIANTS = {
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

/**
 * Variabel untuk menentukan warna ikon berdasarkan jenis alert.
 * Key: variant, Value: class Tailwind CSS.
 */
const ICON_COLORS = {
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

/**
 * Komponen ErrorAlert
 * Menampilkan pesan alert sesuai dengan variant yang dipilih.
 *
 * Parameter:
 * - message (string): Pesan yang akan ditampilkan pada alert.
 * - variant (string): Jenis alert ('error', 'warning', 'info'). Default: 'error'.
 * - dismissible (boolean): Jika true, alert dapat ditutup oleh user. Default: false.
 * - onDismiss (function): Callback yang dipanggil saat alert ditutup.
 * - className (string): Kelas tambahan untuk styling (opsional).
 *
 * Return:
 * - JSX: Komponen alert yang dapat ditampilkan pada halaman.
 */
const ErrorAlert = ({
  message,
  variant = "error",
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  // Jika tidak ada pesan, tidak perlu render komponen
  if (!message) return null;

  // Mendapatkan style dan warna ikon sesuai variant
  const alertStyle = ALERT_VARIANTS[variant] || ALERT_VARIANTS.error;
  const iconColor = ICON_COLORS[variant] || ICON_COLORS.error;

  return (
    <div
      className={`rounded-lg border p-4 mb-4 animate-fadeIn ${alertStyle} ${className}`}
    >
      <div className="flex">
        {/* Ikon alert untuk memperjelas jenis pesan */}
        <ExclamationCircleIcon
          className={`h-5 w-5 ${iconColor} mr-3 flex-shrink-0`}
        />
        <div className="flex-grow">
          <p className="text-sm">{message}</p>
        </div>
        {/* Tombol untuk menutup alert jika dismissible */}
        {dismissible && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex ${iconColor} hover:opacity-80`}
            aria-label="Close"
            onClick={onDismiss}
          >
            <span className="sr-only">Close</span>
            {/* SVG ikon close */}
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
