import React from "react";
const LaporanFilterForm = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onFilter,
  onExportPDF,
  loading,
}) => (
  <div className="flex items-center space-x-2 mb-4">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded"
    />
    <span>-</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded"
    />
    <button
      onClick={onFilter}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Tampilkan
    </button>
    <button
      onClick={onExportPDF}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Ekspor PDF
    </button>
  </div>
);
export default LaporanFilterForm;
