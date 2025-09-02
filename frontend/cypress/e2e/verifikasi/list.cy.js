describe("Verifikasi Permintaan Barang - List Permintaan", () => {
  beforeEach(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/verifikasi");
  });

  it("should show permintaan table and correct columns", () => {
    cy.contains("Verifikasi Permintaan Barang").should("exist");
    cy.get("table").should("exist");
    cy.get("th").contains("Nomor Permintaan").should("exist");
    cy.get("th").contains("Pemohon").should("exist");
    cy.get("th").contains("Tanggal").should("exist");
    cy.get("th").contains("Item").should("exist");
    cy.get("th").contains("Status").should("exist");
    cy.get("th").contains("Aksi").should("exist");
  });

  it("should show empty state if no permintaan", () => {
    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: [], total: 0 },
    }).as("getPermintaanEmpty");

    cy.reload();
    cy.wait("@getPermintaanEmpty");
    cy.contains("Tidak ada data permintaan").should("exist");
  });

  it("should show list of permintaan if available", () => {
    const mockPermintaan = [
      {
        id: 101,
        nomor_permintaan: "#REQ101",
        status: "Menunggu",
        tanggal_permintaan: "2025-09-03T08:00:00.000Z",
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
              kode_barang: "BRG008",
              nama_barang: "Barang Contoh 8",
              satuan: "rim",
              kategori: "ATK",
              stok: 10,
            },
            jumlah_diminta: 10,
            jumlah_disetujui: 0,
          },
        ],
      },
      {
        id: 102,
        nomor_permintaan: "#REQ102",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-04T08:00:00.000Z",
        catatan: "Permintaan printer",
        pemohon: {
          nama: "Sari Dewi",
          unit_kerja: "Statistik Distribusi",
          foto: null,
        },
        details: [
          {
            id: 2,
            barang: {
              kode_barang: "BRG009",
              nama_barang: "Printer Inkjet",
              satuan: "unit",
              kategori: "Elektronik",
              stok: 2,
            },
            jumlah_diminta: 1,
            jumlah_disetujui: 1,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 2 },
    }).as("getPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    // Pastikan data tampil di tabel
    cy.contains("#REQ101").should("exist");
    cy.contains("Budi Santoso").should("exist");
    cy.contains("Statistik Produksi").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.contains("#REQ102").should("exist");
    cy.contains("Sari Dewi").should("exist");
    cy.contains("Statistik Distribusi").should("exist");
    cy.contains("Disetujui").should("exist");
  });

  it("should filter permintaan by status", () => {
    const mockPermintaan = [
      {
        id: 103,
        nomor_permintaan: "#REQ103",
        status: "Menunggu",
        tanggal_permintaan: "2025-09-05T08:00:00.000Z",
        catatan: "Permintaan ATK",
        pemohon: {
          nama: "Andi Wijaya",
          unit_kerja: "Keuangan",
          foto: null,
        },
        details: [
          {
            id: 3,
            barang: {
              kode_barang: "BRG010",
              nama_barang: "Pulpen Merah",
              satuan: "pcs",
              kategori: "ATK",
              stok: 0,
            },
            jumlah_diminta: 5,
            jumlah_disetujui: 0,
          },
        ],
      },
      {
        id: 104,
        nomor_permintaan: "#REQ104",
        status: "Ditolak",
        tanggal_permintaan: "2025-09-06T08:00:00.000Z",
        catatan: "Permintaan barang ditolak",
        pemohon: {
          nama: "Jane Smith",
          unit_kerja: "Finance",
          foto: null,
        },
        details: [
          {
            id: 4,
            barang: {
              kode_barang: "BRG011",
              nama_barang: "Stapler",
              satuan: "pcs",
              kategori: "ATK",
              stok: 100,
            },
            jumlah_diminta: 30,
            jumlah_disetujui: 0,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 2 },
    }).as("getPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    // Filter status "Menunggu"
    cy.get("select.px-3.py-2").select("Menunggu");
    cy.contains("#REQ103").should("exist");
    cy.contains("Andi Wijaya").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.get("table").should("not.contain", "#REQ104");
    cy.get("table").should("not.contain", "Ditolak");

    // Filter status "Ditolak"
    cy.get("select.px-3.py-2").select("Ditolak");
    cy.contains("#REQ104").should("exist");
    cy.contains("Jane Smith").should("exist");
    cy.contains("Ditolak").should("exist");
    cy.get("table").should("not.contain", "#REQ103");
    cy.get("table").should("not.contain", "Menunggu");

    // Reset filter
    cy.get("select.px-3.py-2").select("");
    cy.contains("#REQ103").should("exist");
    cy.contains("#REQ104").should("exist");
  });

  it("should paginate permintaan list", () => {
    // Buat mock data 25 permintaan
    const mockPermintaan = Array.from({ length: 25 }, (_, i) => ({
      id: 200 + i,
      nomor_permintaan: `#REQ${200 + i}`,
      status: i % 2 === 0 ? "Menunggu" : "Disetujui",
      tanggal_permintaan: "2025-09-07T08:00:00.000Z",
      catatan: `Permintaan ke-${i}`,
      pemohon: {
        nama: `Pemohon ${i}`,
        unit_kerja: "Unit Kerja",
        foto: null,
      },
      details: [
        {
          id: 10 + i,
          barang: {
            kode_barang: `BRG${10 + i}`,
            nama_barang: `Barang ${i}`,
            satuan: "pcs",
            kategori: "ATK",
            stok: 10 + i,
          },
          jumlah_diminta: 1 + i,
          jumlah_disetujui: 0,
        },
      ],
    }));

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan.slice(0, 20), total: 25 },
    }).as("getPermintaanPage1");

    cy.reload();
    cy.wait("@getPermintaanPage1");

    // Pastikan hanya 20 data tampil di halaman pertama
    cy.get("table tbody tr").should("have.length.at.most", 20);
    cy.contains("#REQ200").should("exist");
    cy.contains("#REQ219").should("exist");
    cy.contains("#REQ220").should("not.exist");

    // Klik tombol Next untuk ke halaman berikutnya
    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan.slice(20, 25), total: 25 },
    }).as("getPermintaanPage2");

    cy.get("button").contains("Next").click();
    cy.wait("@getPermintaanPage2");

    cy.contains("#REQ220").should("exist");
    cy.contains("#REQ224").should("exist");
    cy.contains("#REQ200").should("not.exist");
  });

  it("should change limit per page", () => {
    // Buat mock data 30 permintaan
    const mockPermintaan = Array.from({ length: 30 }, (_, i) => ({
      id: 300 + i,
      nomor_permintaan: `#REQ${300 + i}`,
      status: "Menunggu",
      tanggal_permintaan: "2025-09-08T08:00:00.000Z",
      catatan: `Permintaan ke-${i}`,
      pemohon: {
        nama: `Pemohon ${i}`,
        unit_kerja: "Unit Kerja",
        foto: null,
      },
      details: [
        {
          id: 20 + i,
          barang: {
            kode_barang: `BRG${20 + i}`,
            nama_barang: `Barang ${i}`,
            satuan: "pcs",
            kategori: "ATK",
            stok: 20 + i,
          },
          jumlah_diminta: 2 + i,
          jumlah_disetujui: 0,
        },
      ],
    }));

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan.slice(0, 10), total: 30 },
    }).as("getPermintaanLimit10");

    cy.reload();
    cy.wait("@getPermintaanLimit10");

    // Pastikan hanya 10 data tampil di halaman pertama
    cy.get("table tbody tr").should("have.length.at.most", 10);

    // Ubah limit ke 20
    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan.slice(0, 20), total: 30 },
    }).as("getPermintaanLimit20");

    cy.get("select").contains("20").parent().select("20");
    cy.wait("@getPermintaanLimit20");
    cy.get("table tbody tr").should("have.length.at.most", 20);

    // Ubah limit ke 50 (harusnya hanya 30 data tersedia)
    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 30 },
    }).as("getPermintaanLimit50");

    cy.get("select").contains("50").parent().select("50");
    cy.wait("@getPermintaanLimit50");
    cy.get("table tbody tr").should("have.length.at.most", 30);
  });
});
