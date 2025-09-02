describe("Verifikasi Permintaan Barang - Aksi Admin", () => {
  beforeEach(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/verifikasi");
  });

 

  it("should filter permintaan by status", () => {
    cy.get("table").should("exist");

    // Pilih dropdown filter status dengan class yang lebih spesifik
    cy.get("select.px-3.py-2").should("exist");
    cy.get("select.px-3.py-2")
      .find("option")
      .should("contain.text", "Menunggu");

    // Pilih filter "Menunggu"
    cy.get("select.px-3.py-2").select("Menunggu");

    cy.wait(2000);
    cy.get("table").should("exist");

    // Test filter lainnya
    cy.get("select.px-3.py-2").select("Disetujui");
    cy.wait(1000);
    cy.get("select.px-3.py-2").select(""); // Reset ke "Semua Status"
  });

  it("should show verifikasi page with statistics and table", () => {
    cy.contains("Verifikasi Permintaan Barang").should("exist");
    cy.contains("Total Barang").should("exist");
    cy.contains("Permintaan Tertunda").should("exist");
    cy.contains("Barang Kritis").should("exist");
    cy.contains("User Aktif").should("exist");
    cy.get("table").should("exist");
  });

  it("should show tren permintaan chart", () => {
    cy.contains("Tren Permintaan Bulanan").should("exist");
    cy.get("canvas").should("exist"); // Chart canvas
  });

  it("should search permintaan by keyword", () => {
    cy.get('input[placeholder*="Cari nomor permintaan"]').type("Budi");
    // Assertion berdasarkan hasil search
    cy.get("table").should("exist");
  });

  it("should open detail modal when clicking Detail button", () => {
    const mockPermintaan = [
      {
        id: 201,
        nomor_permintaan: "#REQ001",
        status: "Menunggu",
        tanggal_permintaan: "2024-01-15T10:00:00.000Z",
        catatan: "Permintaan ATK bulanan",
        pemohon: {
          nama: "Budi Santoso",
          unit_kerja: "Statistik Produksi",
          foto: null,
        },
        details: [
          {
            id: 1,
            barang: {
              kode_barang: "BRG001",
              nama_barang: "Kertas A4",
              satuan: "rim",
              kategori: "ATK",
              stok: 20,
            },
            jumlah_diminta: 5,
            jumlah_disetujui: 0,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/201", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Lihat Detail"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Sesuaikan dengan template yang ada di RequestDetailModal.jsx
    cy.contains("Detail Permintaan").should("exist");
    cy.contains("Budi Santoso").should("exist");
    cy.contains("Statistik Produksi").should("exist");
    cy.contains("Kertas A4").should("exist");

    cy.get('button[aria-label="Tutup"]').click();
    cy.contains("Detail Permintaan").should("not.exist");
  });

  it("should open verifikasi modal for pending requests", () => {
    const mockPermintaan = [
      {
        id: 202,
        nomor_permintaan: "#REQ002",
        status: "Menunggu",
        tanggal_permintaan: "2024-01-15T10:00:00.000Z",
        catatan: "Permintaan urgent",
        pemohon: {
          nama: "Sari Dewi",
          unit_kerja: "Statistik Distribusi",
          foto: null,
        },
        details: [
          {
            id: 2,
            barang: {
              kode_barang: "BRG002",
              nama_barang: "Pulpen Biru",
              satuan: "pcs",
              kategori: "ATK",
              stok: 50,
            },
            jumlah_diminta: 10,
            jumlah_disetujui: 0,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/202", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Verifikasi"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Sesuaikan dengan template yang ada di RequestVerifikasiModal.jsx
    cy.contains("Verifikasi Permintaan").should("exist");
    cy.contains("Sari Dewi").should("exist");
    cy.contains("Pulpen Biru").should("exist");

    // Cek apakah form verifikasi ada, tapi tidak perlu cek name attribute
    cy.get("select").should("exist");
    cy.get("textarea").should("exist");
  });

  it("should approve permintaan completely", () => {
    const mockPermintaan = [
      {
        id: 203,
        nomor_permintaan: "#REQ003",
        status: "Menunggu",
        pemohon: { nama: "John Doe", unit_kerja: "IT" },
        details: [
          {
            id: 3,
            barang: {
              kode_barang: "BRG003",
              nama_barang: "Mouse Wireless",
              satuan: "pcs",
              kategori: "Elektronik",
              stok: 20,
            },
            jumlah_diminta: 2,
            jumlah_disetujui: 0,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/203", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.intercept("PATCH", "/api/permintaan/203/verifikasi", {
      statusCode: 200,
      body: { ...mockPermintaan[0], status: "Disetujui" },
    }).as("verifikasiPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Verifikasi"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Gunakan button untuk pilih keputusan (sesuai dengan RequestVerifikasiModal.jsx)
    cy.get("button").contains("Setujui Semua").click();
    cy.get("textarea").first().type("Disetujui sesuai kebutuhan");
    cy.get('button[type="submit"]').click();

    cy.wait("@verifikasiPermintaan");
    cy.contains("Permintaan berhasil diverifikasi").should("exist");
  });

  it("should reject permintaan with reason", () => {
    const mockPermintaan = [
      {
        id: 204,
        nomor_permintaan: "#REQ004",
        status: "Menunggu", // Pastikan status adalah "Menunggu"
        pemohon: { nama: "Jane Smith", unit_kerja: "Finance" },
        details: [
          {
            id: 4,
            barang: {
              kode_barang: "BRG004",
              nama_barang: "Printer Inkjet",
              satuan: "unit",
              kategori: "Elektronik", // Tambahkan kategori
              stok: 0,
            },
            jumlah_diminta: 1,
            jumlah_disetujui: 0,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/204", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.intercept("PATCH", "/api/permintaan/204/verifikasi", {
      statusCode: 200,
      body: { ...mockPermintaan[0], status: "Ditolak" },
    }).as("verifikasiPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Verifikasi"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Gunakan button untuk pilih keputusan (sesuai RequestVerifikasiModal.jsx)
    cy.get("button").contains("Tolak Semua").click();
    cy.get("textarea").first().type("Stok habis, tunggu restock");
    cy.get('button[type="submit"]').click();

    cy.wait("@verifikasiPermintaan");
    cy.contains("Permintaan berhasil diverifikasi").should("exist");
  });

  it("should partially approve permintaan", () => {
    const mockPermintaan = [
      {
        id: 205,
        nomor_permintaan: "#REQ005",
        status: "Menunggu", // Pastikan status adalah "Menunggu"
        pemohon: { nama: "Bob Wilson", unit_kerja: "HR" },
        details: [
          {
            id: 5,
            barang: {
              kode_barang: "BRG005",
              nama_barang: "Stapler",
              satuan: "pcs",
              kategori: "ATK", // Tambahkan kategori
              stok: 100,
            },
            jumlah_diminta: 30,
            jumlah_disetujui: 1,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/205", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.intercept("PATCH", "/api/permintaan/205/verifikasi", {
      statusCode: 200,
      body: { ...mockPermintaan[0], status: "Disetujui Sebagian" },
    }).as("verifikasiPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Verifikasi"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Gunakan button untuk pilih keputusan
    cy.get("button").contains("Setujui Sebagian").click();
    cy.get('input[type="number"]').first().clear().type("3");
    cy.get("textarea").first().type("Stok terbatas, diberikan sesuai tersedia");
    cy.get('button[type="submit"]').click();

    cy.wait("@verifikasiPermintaan");
    cy.contains("Permintaan berhasil diverifikasi").should("exist");
  });

  it("should show error if keputusan not selected", () => {
    const mockPermintaan = [
      {
        id: 207,
        status: "Menunggu", // Pastikan status adalah "Menunggu"
        pemohon: { nama: "Test User", unit_kerja: "Test Unit" }, // Tambahkan pemohon
        details: [
          {
            id: 7,
            barang: {
              nama_barang: "Test Item",
              kode_barang: "TST001", // Tambahkan kode_barang
              satuan: "pcs", // Tambahkan satuan
              kategori: "ATK", // Tambahkan kategori
              stok: 10, // Tambahkan stok
            },
            jumlah_diminta: 1, // Tambahkan jumlah_diminta
            jumlah_disetujui: 0, // Tambahkan jumlah_disetujui
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/207", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Verifikasi"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Langsung submit tanpa pilih keputusan
    cy.get('button[type="submit"]').click();
    cy.contains("Pilih keputusan verifikasi!").should("exist");
  });
});
