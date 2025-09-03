describe("Cetak Bukti Permintaan - Preview", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show permintaan preview with correct information", () => {
    // Mock detail permintaan
    const mockPermintaan = {
      id: 501,
      nomor_permintaan: "#REQ501",
      status: "Disetujui",
      tanggal_permintaan: "2025-09-15T08:00:00.000Z",
      catatan_admin: "Disetujui oleh admin",
      pemohon: {
        nama: "Budi Santoso",
        unitKerja: "Statistik Produksi",
      },
      items: [
        {
          id: 1,
          barang: {
            nama_barang: "Kertas A4",
            kode_barang: "BRG001",
            satuan: "rim",
          },
          jumlah_diminta: 2,
          jumlah_disetujui: 2,
        },
        {
          id: 2,
          barang: {
            nama_barang: "Pulpen Biru",
            kode_barang: "BRG002",
            satuan: "pcs",
          },
          jumlah_diminta: 10,
          jumlah_disetujui: 10,
        },
      ],
    };

    cy.intercept("GET", "/api/permintaan/501", {
      statusCode: 200,
      body: mockPermintaan,
    }).as("getPermintaan");

    cy.visit("/admin/permintaan/501/cetak");
    cy.wait("@getPermintaan");

    // Assert preview detail permintaan
    cy.contains("Cetak Bukti Permintaan").should("exist");
    cy.contains("Bukti Permintaan #REQ501").should("exist");
    cy.contains("Budi Santoso").should("exist");
    cy.contains("Statistik Produksi").should("exist");
    cy.contains("Disetujui oleh admin").should("exist");
    cy.contains("Disetujui").should("exist");
    cy.contains("Kertas A4").should("exist");
    cy.contains("Pulpen Biru").should("exist");
    cy.contains("rim").should("exist");
    cy.contains("pcs").should("exist");
    cy.contains("2").should("exist");
    cy.contains("10").should("exist");
    cy.contains("Total Item: 2").should("exist");

    // Cek kolom tabel barang
    cy.get("table").should("exist");
    cy.get("th").contains("Barang").should("exist");
    cy.get("th").contains("Jumlah Diminta").should("exist");
    cy.get("th").contains("Jumlah Disetujui").should("exist");
    cy.get("th").contains("Satuan").should("exist");
  });

  it("should show loading state when fetching data", () => {
    cy.intercept("GET", "/api/permintaan/501", (req) => {
      // Simulasi loading dengan delay
      req.on("response", (res) => {
        res.setDelay(1500);
      });
      req.reply({
        statusCode: 200,
        body: {},
      });
    }).as("getPermintaan");

    cy.visit("/admin/permintaan/501/cetak");
    cy.contains("Memuat data permintaan...").should("exist");
  });

  it("should show error state if API fails", () => {
    cy.intercept("GET", "/api/permintaan/501", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("getPermintaan");

    cy.visit("/admin/permintaan/501/cetak");
    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Coba Lagi").should("exist");
  });

  it("should show not found state if permintaan is null", () => {
    cy.intercept("GET", "/api/permintaan/999", {
      statusCode: 404,
      body: {},
    }).as("getPermintaan");

    cy.visit("/admin/permintaan/999/cetak");
    cy.contains("Data permintaan tidak ditemukan").should("exist");
    cy.contains("Kembali").should("exist");
  });
});
