import React from "react";

/**
 * Komponen PageSizeSelector
 *
 * Komponen ini digunakan untuk memilih jumlah data yang ditampilkan per halaman.
 *
 * Parameter:
 * - pageSize (number): Jumlah data per halaman saat ini
 * - onPageSizeChange (function): Callback ketika page size berubah
 * - options (array): Pilihan page size (default: [10, 20, 50, 100])
 * - loading (boolean): Status loading
 *
 * Return:
 * - React.Element: Komponen selector page size
 */
const PageSizeSelector = ({
  pageSize,
  onPageSizeChange,
  options = [10, 20, 50, 100],
  loading = false,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Tampilkan:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        disabled={loading}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">per halaman</span>
    </div>
  );
};

export default PageSizeSelector;
