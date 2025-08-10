import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const variants = {
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

const iconColors = {
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

/**
 * Komponen alert untuk menampilkan pesan error
 * @param {string} message - Pesan error yang ditampilkan
 * @param {string} variant - Variant style (error, warning, info)
 * @param {boolean} dismissible - Apakah alert bisa ditutup
 * @param {function} onDismiss - Callback saat alert ditutup
 * @param {string} className - Kelas tambahan (optional)
 */
const ErrorAlert = ({
  message,
  variant = "error",
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-lg border p-4 mb-4 animate-fadeIn ${variants[variant]} ${className}`}
    >
      <div className="flex">
        <ExclamationCircleIcon
          className={`h-5 w-5 ${iconColors[variant]} mr-3 flex-shrink-0`}
        />
        <div className="flex-grow">
          <p className="text-sm">{message}</p>
        </div>
        {dismissible && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex ${iconColors[variant]} hover:opacity-80`}
            aria-label="Close"
            onClick={onDismiss}
          >
            <span className="sr-only">Close</span>
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
