import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Mock data untuk development (ganti dengan API call nanti)
const mockPermintaan = [
  {
    id: 1,
    nomorPermintaan: 'REQ-2024-001',
    pemohon: {
      nama: 'Divany',
      unitKerja: 'Bagian Umum'
    },
    tanggalPermintaan: '2024-07-24',
    status: 'Menunggu',
    totalItem: 3,
    items: [
      {
        id: 1,
        namaBarang: 'Kertas A4 80gsm',
        jumlahDiminta: 5,
        satuan: 'rim',
        stokTersedia: 15,
        jumlahDisetujui: 0
      },
      {
        id: 2,
        namaBarang: 'Spidol Whiteboard',
        jumlahDiminta: 3,
        satuan: 'pcs',
        stokTersedia: 5,
        jumlahDisetujui: 0
      },
      {
        id: 3,
        namaBarang: 'Toner Printer HP',
        jumlahDiminta: 2,
        satuan: 'pcs',
        stokTersedia: 25,
        jumlahDisetujui: 0
      }
    ],
    catatan: 'Untuk keperluan rapat koordinasi bulanan'
  },
  {
    id: 2,
    nomorPermintaan: 'REQ-2024-002',
    pemohon: {
      nama: 'Arya',
      unitKerja: 'Statistik Produksi'
    },
    tanggalPermintaan: '2024-07-23',
    status: 'Menunggu',
    totalItem: 2,
    items: [
      {
        id: 4,
        namaBarang: 'Kertas A4 80gsm',
        jumlahDiminta: 3,
        satuan: 'rim',
        stokTersedia: 15,
        jumlahDisetujui: 0
      },
      {
        id: 5,
        namaBarang: 'Folder Plastik',
        jumlahDiminta: 20,
        satuan: 'pcs',
        stokTersedia: 8,
        jumlahDisetujui: 0
      }
    ],
    catatan: 'Untuk dokumentasi survei lapangan'
  },
  {
    id: 3,
    nomorPermintaan: 'REQ-2024-003',
    pemohon: {
      nama: 'Pratama',
      unitKerja: 'Statistik Sosial'
    },
    tanggalPermintaan: '2024-07-22',
    status: 'Disetujui',
    totalItem: 1,
    items: [
      {
        id: 6,
        namaBarang: 'Pulpen Biru',
        jumlahDiminta: 12,
        satuan: 'pcs',
        stokTersedia: 50,
        jumlahDisetujui: 12
      }
    ],
    catatan: 'Untuk kebutuhan survei rumah tangga',
    catatanVerifikasi: 'Disetujui sepenuhnya',
    tanggalVerifikasi: '2024-07-22'
  }
];

const RequestVerification = () => {
  const [permintaan, setPermintaan] = useState(mockPermintaan);
  const [filteredPermintaan, setFilteredPermintaan] = useState(mockPermintaan);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [selectedPermintaan, setSelectedPermintaan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verifikasi form state
  const [verifikasiData, setVerifikasiData] = useState({
    keputusan: '', // 'setuju', 'sebagian', 'tolak'
    catatanVerifikasi: '',
    items: []
  });

  // Status options
  const statusOptions = [
    { value: 'Menunggu', label: 'Menunggu', color: 'yellow' },
    { value: 'Disetujui', label: 'Disetujui', color: 'green' },
    { value: 'Disetujui Sebagian', label: 'Disetujui Sebagian', color: 'orange' },
    { value: 'Ditolak', label: 'Ditolak', color: 'red' }
  ];

  // Filter effect
  useEffect(() => {
    let filtered = permintaan;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nomorPermintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pemohon.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pemohon.unitKerja.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredPermintaan(filtered);
  }, [searchTerm, filterStatus, permintaan]);

  // Open detail modal
  const openDetailModal = (item) => {
    setSelectedPermintaan(item);
    setShowDetailModal(true);
  };

  // Open verifikasi modal
  const openVerifikasiModal = (item) => {
    setSelectedPermintaan(item);
    setVerifikasiData({
      keputusan: '',
      catatanVerifikasi: '',
      items: item.items.map(itm => ({
        id: itm.id,
        namaBarang: itm.namaBarang,
        jumlahDiminta: itm.jumlahDiminta,
        jumlahDisetujui: itm.jumlahDiminta, // Default: setujui semua
        stokTersedia: itm.stokTersedia,
        satuan: itm.satuan
      }))
    });
    setShowVerifikasiModal(true);
  };

  // Handle verifikasi input changes
  const handleVerifikasiChange = (e) => {
    const { name, value } = e.target;
    setVerifikasiData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle item quantity change
  const handleItemQuantityChange = (itemId, newQuantity) => {
    setVerifikasiData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, jumlahDisetujui: parseInt(newQuantity) || 0 }
          : item
      )
    }));
  };

  // Handle keputusan change
  const handleKeputusanChange = (keputusan) => {
    let updatedItems = [...verifikasiData.items];
    
    if (keputusan === 'setuju') {
      // Setujui semua dengan jumlah diminta
      updatedItems = updatedItems.map(item => ({
        ...item,
        jumlahDisetujui: item.jumlahDiminta
      }));
    } else if (keputusan === 'tolak') {
      // Tolak semua (jumlah disetujui = 0)
      updatedItems = updatedItems.map(item => ({
        ...item,
        jumlahDisetujui: 0
      }));
    }
    // Jika 'sebagian', biarkan user mengatur manual

    setVerifikasiData(prev => ({
      ...prev,
      keputusan,
      items: updatedItems
    }));
  };

  // Submit verifikasi
  const handleVerifikasiSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      let newStatus = 'Ditolak';
      const totalDisetujui = verifikasiData.items.reduce((sum, item) => sum + item.jumlahDisetujui, 0);
      const totalDiminta = verifikasiData.items.reduce((sum, item) => sum + item.jumlahDiminta, 0);

      if (totalDisetujui === totalDiminta && totalDisetujui > 0) {
        newStatus = 'Disetujui';
      } else if (totalDisetujui > 0) {
        newStatus = 'Disetujui Sebagian';
      }

      // Update permintaan
      setPermintaan(prev => prev.map(item => 
        item.id === selectedPermintaan.id 
          ? { 
              ...item, 
              status: newStatus,
              items: item.items.map(itm => {
                const updatedItem = verifikasiData.items.find(vi => vi.id === itm.id);
                return updatedItem ? { ...itm, jumlahDisetujui: updatedItem.jumlahDisetujui } : itm;
              }),
              catatanVerifikasi: verifikasiData.catatanVerifikasi,
              tanggalVerifikasi: new Date().toISOString().split('T')[0]
            }
          : item
      ));

      setLoading(false);
      setShowVerifikasiModal(false);
      // Show success toast here
    }, 1500);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    const colorMap = {
      yellow: 'text-yellow-700 bg-yellow-100',
      green: 'text-green-700 bg-green-100',
      orange: 'text-orange-700 bg-orange-100',
      red: 'text-red-700 bg-red-100'
    };
    return colorMap[statusObj?.color] || 'text-gray-700 bg-gray-100';
  };

  // Get row background color based on decision and item status
  const getRowBackgroundColor = (item) => {
    if (verifikasiData.keputusan === 'tolak') {
      return 'bg-red-50 border-red-200'; // Semua merah jika tolak
    } else if (verifikasiData.keputusan === 'setuju') {
      return item.stokTersedia < item.jumlahDiminta ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'; // Hijau semua jika setuju (kecuali stok kurang)
    } else if (verifikasiData.keputusan === 'sebagian') {
      // Untuk setuju sebagian, warna berdasarkan jumlah disetujui
      if (item.jumlahDisetujui === 0) {
        return 'bg-red-50 border-red-200'; // Merah jika ditolak
      } else if (item.jumlahDisetujui === item.jumlahDiminta) {
        return 'bg-green-50 border-green-200'; // Hijau jika disetujui penuh
      } else if (item.jumlahDisetujui > 0) {
        return 'bg-yellow-50 border-yellow-200'; // Kuning jika sebagian
      }
    }
    return item.stokTersedia < item.jumlahDiminta ? 'bg-red-50 border-red-200' : 'bg-white'; // Default
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Permintaan</h1>
        <p className="text-gray-600">Kelola dan verifikasi permintaan barang dari pegawai</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Permintaan</p>
              <p className="text-2xl font-bold text-gray-900">{permintaan.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
              <p className="text-2xl font-bold text-yellow-600">
                {permintaan.filter(item => item.status === 'Menunggu').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-green-600">
                {permintaan.filter(item => item.status === 'Disetujui' || item.status === 'Disetujui Sebagian').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">
                {permintaan.filter(item => item.status === 'Ditolak').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor permintaan, nama, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Status */}
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
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
                  Nomor Permintaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemohon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPermintaan.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Tidak ada data permintaan</p>
                    <p className="mt-1">Coba ubah filter pencarian</p>
                  </td>
                </tr>
              ) : (
                filteredPermintaan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{item.nomorPermintaan}</div>
                      <div className="text-sm text-gray-500">ID: {item.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.pemohon.nama}</div>
                          <div className="text-sm text-gray-500">{item.pemohon.unitKerja}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(item.tanggalPermintaan)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.totalItem} Item</div>
                      <div className="text-sm text-gray-500">
                        {item.items.slice(0, 2).map(itm => itm.namaBarang).join(', ')}
                        {item.items.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openDetailModal(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {item.status === 'Menunggu' && (
                          <button
                            onClick={() => openVerifikasiModal(item)}
                            className="text-green-600 hover:text-green-800"
                            title="Verifikasi"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detail Permintaan - {selectedPermintaan.nomorPermintaan}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Permintaan Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Pemohon</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nama:</span> {selectedPermintaan.pemohon.nama}</div>
                    <div><span className="font-medium">Unit Kerja:</span> {selectedPermintaan.pemohon.unitKerja}</div>
                    <div><span className="font-medium">Tanggal:</span> {formatDate(selectedPermintaan.tanggalPermintaan)}</div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPermintaan.status)}`}>
                        {selectedPermintaan.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedPermintaan.catatanVerifikasi && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Catatan Verifikasi</h4>
                    <p className="text-sm text-gray-700">{selectedPermintaan.catatanVerifikasi}</p>
                    {selectedPermintaan.tanggalVerifikasi && (
                      <p className="text-xs text-gray-500 mt-2">
                        Diverifikasi: {formatDate(selectedPermintaan.tanggalVerifikasi)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Daftar Barang Diminta</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diminta</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stok Tersedia</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Disetujui</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPermintaan.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.namaBarang}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.jumlahDiminta} {item.satuan}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">{item.stokTersedia} {item.satuan}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {selectedPermintaan.status === 'Menunggu' ? '-' : `${item.jumlahDisetujui} ${item.satuan}`}
                          </td>
                          <td className="px-4 py-2">
                            {item.stokTersedia < item.jumlahDiminta ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                Stok Kurang
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                <CheckIcon className="w-3 h-3 mr-1" />
                                Stok Cukup
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Catatan Permintaan */}
              {selectedPermintaan.catatan && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Catatan Permintaan</h4>
                  <p className="text-sm text-gray-700">{selectedPermintaan.catatan}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                {selectedPermintaan.status === 'Menunggu' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openVerifikasiModal(selectedPermintaan);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Verifikasi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verifikasi Modal */}
      {showVerifikasiModal && selectedPermintaan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Verifikasi Permintaan - {selectedPermintaan.nomorPermintaan}
                </h3>
                <button
                  onClick={() => setShowVerifikasiModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleVerifikasiSubmit}>
                {/* Keputusan */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Keputusan Verifikasi</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="keputusan"
                        value="sebagian"
                        checked={verifikasiData.keputusan === 'sebagian'}
                        onChange={(e) => handleKeputusanChange(e.target.value)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-orange-700 font-medium">Setuju Sebagian</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="keputusan"
                        value="tolak"
                        checked={verifikasiData.keputusan === 'tolak'}
                        onChange={(e) => handleKeputusanChange(e.target.value)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-700 font-medium">Tolak Semua</span>
                    </label>
                  </div>
                </div>

                {/* Items Verification Table */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Detail Verifikasi per Item</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diminta</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok Tersedia</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Disetujui</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {verifikasiData.items.map((item) => (
                          <tr key={item.id} className={`border-l-4 ${getRowBackgroundColor(item)}`}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.namaBarang}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.jumlahDiminta} {item.satuan}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              <span className={item.stokTersedia < item.jumlahDiminta ? 'text-red-600 font-medium' : ''}>
                                {item.stokTersedia} {item.satuan}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max={Math.min(item.jumlahDiminta, item.stokTersedia)}
                                value={item.jumlahDisetujui}
                                onChange={(e) => handleItemQuantityChange(item.id, e.target.value)}
                                disabled={verifikasiData.keputusan === 'setuju' || verifikasiData.keputusan === 'tolak'}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                              />
                              <span className="ml-1 text-sm text-gray-500">{item.satuan}</span>
                            </td>
                            <td className="px-4 py-3">
                              {item.stokTersedia < item.jumlahDiminta ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                  <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                  Stok Kurang
                                </span>
                              ) : item.jumlahDisetujui === item.jumlahDiminta ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                  <CheckIcon className="w-3 h-3 mr-1" />
                                  Disetujui
                                </span>
                              ) : item.jumlahDisetujui > 0 ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                  Sebagian
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                  <XMarkIcon className="w-3 h-3 mr-1" />
                                  Ditolak
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Warning untuk stok kurang */}
                  {verifikasiData.items.some(item => item.stokTersedia < item.jumlahDiminta) && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-sm text-red-700 font-medium">
                          Ada item dengan stok tidak mencukupi. Silakan sesuaikan jumlah yang disetujui.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Ringkasan Verifikasi</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Item Diminta:</span>
                      <p className="font-medium">{verifikasiData.items.reduce((sum, item) => sum + item.jumlahDiminta, 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Item Disetujui:</span>
                      <p className="font-medium text-green-600">{verifikasiData.items.reduce((sum, item) => sum + item.jumlahDisetujui, 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Persentase Persetujuan:</span>
                      <p className="font-medium">
                        {verifikasiData.items.reduce((sum, item) => sum + item.jumlahDiminta, 0) > 0 
                          ? Math.round((verifikasiData.items.reduce((sum, item) => sum + item.jumlahDisetujui, 0) / verifikasiData.items.reduce((sum, item) => sum + item.jumlahDiminta, 0)) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catatan Verifikasi */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Verifikasi <span className="text-gray-500 text-sm">(Opsional)</span>
                  </label>
                  <textarea
                    name="catatanVerifikasi"
                    value={verifikasiData.catatanVerifikasi}
                    onChange={handleVerifikasiChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Berikan catatan atau alasan untuk keputusan verifikasi (opsional)..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowVerifikasiModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !verifikasiData.keputusan}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Memproses...' : 'Simpan Verifikasi'}
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

export default RequestVerification;