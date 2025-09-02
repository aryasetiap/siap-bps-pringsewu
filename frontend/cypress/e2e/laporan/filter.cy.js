describe("Laporan Periodik - Filter Laporan Penggunaan Barang", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/laporan");
  });

  it("should show filter form and table", () => {
    cy.contains("Filter Laporan").should("exist");
    cy.get('input[type="date"]').should("have.length", 2);
    cy.get("select").should("exist");
    cy.get("button").contains("Filter Data").should("exist");
    cy.contains("Tidak ada data penggunaan barang").should("exist");
    cy.contains(
      "Tidak ditemukan data penggunaan barang dalam periode yang dipilih."
    ).should("exist");
  });

  it("should filter laporan by tanggal", () => {
    // Mock data laporan
    const mockLaporan = [
      {
        nama_barang: "Kertas A4",
        kode_barang: "BRG001",
        total_digunakan: 10,
        satuan: "rim",
        tanggal_permintaan: "2025-09-05",
      },
      {
        nama_barang: "Printer Inkjet",
        kode_barang: "BRG009",
        total_digunakan: 2,
        satuan: "unit",
        tanggal_permintaan: "2025-09-10",
      },
    ];

    cy.intercept("GET", "/api/barang/laporan-penggunaan*", {
      statusCode: 200,
      body: mockLaporan,
    }).as("getLaporan");

    cy.get('input[type="date"]').first().clear().type("2025-09-01");
    cy.get('input[type="date"]').last().clear().type("2025-09-30");
    cy.get("button").contains("Filter Data").click();
    cy.wait("@getLaporan");

    cy.contains("Kertas A4").should("exist");
    cy.contains("Printer Inkjet").should("exist");
    cy.contains("BRG001").should("exist");
    cy.contains("BRG009").should("exist");
    cy.contains("rim").should("exist");
    cy.contains("unit").should("exist");
    cy.contains("10").should("exist");
    cy.contains("2").should("exist");
  });

  it("should filter laporan by unit kerja", () => {
    // Mock data laporan hanya untuk unit kerja tertentu
    const mockLaporanUnit = [
      {
        nama_barang: "Pulpen Biru",
        kode_barang: "BRG002",
        total_digunakan: 5,
        satuan: "pcs",
        tanggal_permintaan: "2025-09-15",
      },
    ];

    cy.intercept("GET", "/api/barang/laporan-penggunaan*", {
      statusCode: 200,
      body: mockLaporanUnit,
    }).as("getLaporanUnit");

    cy.get("select").first().select("Statistik Produksi");
    cy.get("button").contains("Filter Data").click();
    cy.wait("@getLaporanUnit");

    cy.contains("Pulpen Biru").should("exist");
    cy.contains("BRG002").should("exist");
    cy.contains("pcs").should("exist");
    cy.contains("5").should("exist");
  });

  it("should show empty state if no laporan found", () => {
    cy.intercept("GET", "/api/barang/laporan-penggunaan*", {
      statusCode: 200,
      body: [],
    }).as("getLaporanKosong");

    cy.get('input[type="date"]').first().clear().type("2025-08-01");
    cy.get('input[type="date"]').last().clear().type("2025-08-31");
    cy.get("button").contains("Filter Data").click();
    cy.wait("@getLaporanKosong");

    cy.contains("Tidak ada data penggunaan barang").should("exist");
    cy.contains(
      "Tidak ditemukan data penggunaan barang dalam periode yang dipilih."
    ).should("exist");
  });

  it("should use preset tanggal 30 hari terakhir", () => {
    cy.intercept("GET", "/api/barang/laporan-penggunaan*", {
      statusCode: 200,
      body: [],
    }).as("getLaporanPreset");

    cy.get("button").contains("30 Hari Terakhir").click();
    cy.get("button").contains("Filter Data").click();
    cy.wait("@getLaporanPreset");

    cy.get('input[type="date"]').first().invoke("val").should("not.be.empty");
    cy.get('input[type="date"]').last().invoke("val").should("not.be.empty");
  });

  it("should use preset tanggal bulan ini", () => {
    cy.intercept("GET", "/api/barang/laporan-penggunaan*", {
      statusCode: 200,
      body: [],
    }).as("getLaporanPresetBulan");

    cy.get("button").contains("Bulan Ini").click();
    cy.get("button").contains("Filter Data").click();
    cy.wait("@getLaporanPresetBulan");

    cy.get('input[type="date"]').first().invoke("val").should("not.be.empty");
    cy.get('input[type="date"]').last().invoke("val").should("not.be.empty");
  });
});
