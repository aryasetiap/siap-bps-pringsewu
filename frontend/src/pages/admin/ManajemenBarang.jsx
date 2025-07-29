/*
API ROUTES (DUMMY BACKEND)

GET    /api/barang
  - Ambil semua data barang

GET    /api/barang/:id
  - Ambil detail barang berdasarkan ID

POST   /api/barang
  - Tambah barang baru
  Body:
    {
      kode: string,
      nama: string,
      kategori: string,
      satuan: string,
      stok: number,
      stokMinimum: number,
      deskripsi: string
    }

PUT    /api/barang/:id
  - Edit barang berdasarkan ID
  Body sama seperti POST

DELETE /api/barang/:id
  - Hapus barang berdasarkan ID

POST   /api/barang/:id/tambah-stok
  - Tambah stok barang
  Body:
    {
      jumlahTambah: number,
      keterangan: string
    }
*/

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

// Mock data untuk development (ganti dengan API call nanti)
const mockBarang = [
  {
    id: 1,
    kode: 'BRG001',
    nama: 'Kertas A4 80gsm',
    kategori: 'Alat Tulis Kantor',
    satuan: 'rim',
    stok: 15,
    stokMinimum: 10,
    deskripsi: 'Kertas A4 putih untuk keperluan cetak dokumen'
  },
  {
    id: 2,
    kode: 'BRG002',
    nama: 'Spidol Whiteboard',
    kategori: 'Alat Tulis Kantor',
    satuan: 'pcs',
    stok: 5,
    stokMinimum: 8,
    deskripsi: 'Spidol untuk papan tulis putih'
  },
  {
    id: 3,
    kode: 'BRG003',
    nama: 'Toner Printer HP',
    kategori: 'Consumables',
    satuan: 'pcs',
    stok: 25,
    stokMinimum: 5,
    deskripsi: 'Toner cartridge untuk printer HP LaserJet'
  }
];

const ManajemenBarang = () => {
  const [barang, setBarang] = useState(mockBarang);
  const [filteredBarang, setFilteredBarang] = useState(mockBarang);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStokModal, setShowStokModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategori: '',
    satuan: '',
    stok: '',
    stokMinimum: '',
    deskripsi: ''
  });

  // Stok form state
  const [stokData, setStokData] = useState({
    jumlahTambah: '',
    keterangan: ''
  });

  // Categories dan Satuan options
  const kategoriOptions = ['Alat Tulis Kantor', 'Consumables', 'Perlengkapan', 'Elektronik'];
  const satuanOptions = ['pcs', 'box', 'rim', 'pack', 'unit', 'set'];

  // Filter dan Search effect
  useEffect(() => {
    let filtered = barang;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterKategori) {
      filtered = filtered.filter(item => item.kategori === filterKategori);
    }

    // Status filter
    if (filterStatus) {
      if (filterStatus === 'kritis') {
        filtered = filtered.filter(item => item.stok <= item.stokMinimum);
      } else if (filterStatus === 'normal') {
        filtered = filtered.filter(item => item.stok > item.stokMinimum);
      }
    }

    setFilteredBarang(filtered);
  }, [searchTerm, filterKategori, filterStatus, barang]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle stok form changes
  const handleStokChange = (e) => {
    const { name, value } = e.target;
    setStokData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open add modal
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      kode: '',
      nama: '',
      kategori: '',
      satuan: '',
      stok: '',
      stokMinimum: '',
      deskripsi: ''
    });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedBarang(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      satuan: item.satuan,
      stok: item.stok.toString(),
      stokMinimum: item.stokMinimum.toString(),
      deskripsi: item.deskripsi
    });
    setShowModal(true);
  };

  // Open stok modal
  const openStokModal = (item) => {
    setSelectedBarang(item);
    setStokData({
      jumlahTambah: '',
      keterangan: ''
    });
    setShowStokModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (modalMode === 'add') {
        const newItem = {
          id: barang.length + 1,
          ...formData,
          stok: parseInt(formData.stok),
          stokMinimum: parseInt(formData.stokMinimum)
        };
        setBarang(prev => [...prev, newItem]);
      } else {
        setBarang(prev => prev.map(item => 
          item.id === selectedBarang.id 
            ? { ...item, ...formData, stok: parseInt(formData.stok), stokMinimum: parseInt(formData.stokMinimum) }
            : item
        ));
      }
      setLoading(false);
      setShowModal(false);
      // Show success toast here
    }, 1000);
  };

  // Submit stok tambah
  const handleStokSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setBarang(prev => prev.map(item => 
        item.id === selectedBarang.id 
          ? { ...item, stok: item.stok + parseInt(stokData.jumlahTambah) }
          : item
      ));
      setLoading(false);
      setShowStokModal(false);
      // Show success toast here
    }, 1000);
  };

  // Delete item
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setBarang(prev => prev.filter(item => item.id !== id));
    }
  };

  // Get status color
  const getStatusColor = (stok, stokMinimum) => {
    if (stok <= stokMinimum) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-green-600 bg-green-100';
  };

  // Get status text
  const getStatusText = (stok, stokMinimum) => {
    if (stok <= stokMinimum) {
      return 'Kritis';
    }
    return 'Normal';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Barang</h1>
        <p className="text-gray-600">Kelola data barang dan stok persediaan</p>
      </div>

      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {kategoriOptions.map(kategori => (
                <option key={kategori} value={kategori}>{kategori}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="normal">Normal</option>
              <option value="kritis">Stok Kritis</option>
            </select>

            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Barang
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBarang.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.kode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                      <div className="text-sm text-gray-500">{item.satuan}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.kategori}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.stok} {item.satuan}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.stokMinimum} {item.satuan}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.stok, item.stokMinimum)}`}>
                      {getStatusText(item.stok, item.stokMinimum)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Barang"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openStokModal(item)}
                        className="text-green-600 hover:text-green-900"
                        title="Tambah Stok"
                      >
                        <PlusCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus Barang"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalMode === 'add' ? 'Tambah Barang Baru' : 'Edit Barang'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    name="kode"
                    value={formData.kode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map(kategori => (
                      <option key={kategori} value={kategori}>{kategori}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan
                  </label>
                  <select
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Satuan</option>
                    {satuanOptions.map(satuan => (
                      <option key={satuan} value={satuan}>{satuan}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stok Awal
                    </label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stok Minimum
                    </label>
                    <input
                      type="number"
                      name="stokMinimum"
                      value={formData.stokMinimum}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stok Modal */}
      {showStokModal && selectedBarang && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tambah Stok Barang
              </h3>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Nama Barang:</p>
                <p className="font-medium">{selectedBarang.nama}</p>
                <p className="text-sm text-gray-600 mt-1">Stok Saat Ini:</p>
                <p className="font-medium">{selectedBarang.stok} {selectedBarang.satuan}</p>
              </div>
              
              <form onSubmit={handleStokSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Penambahan
                  </label>
                  <input
                    type="number"
                    name="jumlahTambah"
                    value={stokData.jumlahTambah}
                    onChange={handleStokChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan (Opsional)
                  </label>
                  <input
                    type="text"
                    name="keterangan"
                    value={stokData.keterangan}
                    onChange={handleStokChange}
                    placeholder="Misal: Pembelian, Sumbangan, dll"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {stokData.jumlahTambah && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-600">Stok Setelah Penambahan:</p>
                    <p className="font-medium text-blue-800">
                      {selectedBarang.stok + parseInt(stokData.jumlahTambah || 0)} {selectedBarang.satuan}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStokModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Menambah...' : 'Tambah Stok'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenBarang;