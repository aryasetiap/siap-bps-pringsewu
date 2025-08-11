import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService"; // Cambia getUserList por getAllUsers

const LaporanFilterForm = ({
  startDate,
  endDate,
  unitKerja,
  setStartDate,
  setEndDate,
  setUnitKerja,
  onFilter,
  onExportPDF,
  loading,
}) => {
  const [unitKerjaList, setUnitKerjaList] = useState([]);

  useEffect(() => {
    const fetchUnitKerja = async () => {
      try {
        // Fetch users para obtener lista de unidades de trabajo
        const response = await getAllUsers(); // Cambia getUserList por getAllUsers
        // Extrae valores únicos de unit_kerja
        const uniqueUnitKerja = [
          ...new Set(response.data.map((user) => user.unit_kerja)),
        ];
        setUnitKerjaList(uniqueUnitKerja);
      } catch (error) {
        console.error("Error fetching unit kerja list:", error);
      }
    };

    fetchUnitKerja();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Kerja
          </label>
          <select
            value={unitKerja || ""}
            onChange={(e) => setUnitKerja(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Semua Unit Kerja</option>
            {unitKerjaList.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
        <button
          onClick={onFilter}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Filter Data"}
        </button>
        <button
          onClick={onExportPDF}
          disabled={loading || !startDate || !endDate}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Ekspor PDF
        </button>
      </div>
    </div>
  );
};

export default LaporanFilterForm;
