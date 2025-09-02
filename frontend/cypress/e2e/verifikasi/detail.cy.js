describe("Verifikasi Permintaan Barang - Detail Modal", () => {
  beforeEach(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/verifikasi");
  });

  it("should open detail modal and show correct information", () => {
    const mockPermintaan = [
      {
        id: 301,
        nomor_permintaan: "#REQ301",
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
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/301", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    // Klik tombol detail pada baris permintaan
    cy.get('button[title="Lihat Detail"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Modal detail harus muncul dan menampilkan data yang benar
    cy.contains("Detail Permintaan").should("exist");
    cy.contains("#REQ301").should("exist");
    cy.contains("Budi Santoso").should("exist");
    cy.contains("Statistik Produksi").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.contains("Permintaan ATK bulanan").should("exist");
    cy.contains("Barang Contoh 8").should("exist");
    cy.contains("BRG008").should("exist");
    cy.contains("ATK").should("exist");
    cy.contains("10").should("exist");
    cy.contains("rim").should("exist");

    // Tutup modal
    cy.get('button[aria-label="Tutup"]').click();
    cy.contains("Detail Permintaan").should("not.exist");
  });

  it("should show correct table columns in detail modal", () => {
    const mockPermintaan = [
      {
        id: 302,
        nomor_permintaan: "#REQ302",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-03T08:00:00.000Z",
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
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/302", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Lihat Detail"]').first().click();
    cy.wait("@getDetailPermintaan");

    // Cek kolom tabel barang di modal
    cy.get("table").should("exist");
    cy.get("th").contains("Kode").should("exist");
    cy.get("th").contains("Nama Barang").should("exist");
    cy.get("th").contains("Kategori").should("exist");
    cy.get("th").contains("Jumlah Diminta").should("exist");
    cy.get("th").contains("Jumlah Disetujui").should("exist");
    cy.get("th").contains("Satuan").should("exist");
    cy.get("th").contains("Stok Tersedia").should("exist");

    // Tutup modal
    cy.get('button[aria-label="Tutup"]').click();
    cy.contains("Detail Permintaan").should("not.exist");
  });

  it("should close detail modal when clicking close button", () => {
    const mockPermintaan = [
      {
        id: 303,
        nomor_permintaan: "#REQ303",
        status: "Ditolak",
        tanggal_permintaan: "2025-09-03T08:00:00.000Z",
        catatan: "Permintaan barang ditolak",
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
    ];

    cy.intercept("GET", "/api/permintaan/all*", {
      statusCode: 200,
      body: { data: mockPermintaan, total: 1 },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/303", {
      statusCode: 200,
      body: mockPermintaan[0],
    }).as("getDetailPermintaan");

    cy.reload();
    cy.wait("@getPermintaan");

    cy.get('button[title="Lihat Detail"]').first().click();
    cy.wait("@getDetailPermintaan");

    cy.contains("Detail Permintaan").should("exist");
    cy.get('button[aria-label="Tutup"]').click();
    cy.contains("Detail Permintaan").should("not.exist");
  });
});
