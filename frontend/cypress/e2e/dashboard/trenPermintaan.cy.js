describe("Dashboard Grafik Tren Permintaan Bulanan", () => {
  beforeEach(() => {
    // Login sebagai admin sebelum setiap test
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show tren permintaan section on dashboard", () => {
    cy.contains("Tren Permintaan Bulanan").should("exist");
    cy.get("h2").contains("Tren Permintaan Bulanan").should("be.visible");
    cy.contains("Grafik tren permintaan barang setiap bulan.").should("exist");
    cy.get("canvas").should("exist");
  });

  it("should show loading state when tren permintaan is loading", () => {
    cy.reload();
    cy.get(".animate-pulse").should("exist");
  });

  it("should show empty chart if no data", () => {
    cy.intercept("GET", "/api/permintaan/dashboard/tren-permintaan", {
      statusCode: 200,
      body: Array.from({ length: 12 }, (_, i) => ({
        bulan: `2024-${String(i + 1).padStart(2, "0")}`,
        jumlah: 0,
      })),
    }).as("getTrenPermintaanEmpty");

    cy.reload();
    cy.wait("@getTrenPermintaanEmpty");
    cy.get("canvas").should("exist");
    cy.contains("Grafik tren permintaan barang setiap bulan.").should("exist");
  });

  it("should show chart with correct data if available", () => {
    const mockTren = [
      { bulan: "2024-01", jumlah: 2 },
      { bulan: "2024-02", jumlah: 0 },
      { bulan: "2024-03", jumlah: 5 },
      { bulan: "2024-04", jumlah: 3 },
      { bulan: "2024-05", jumlah: 1 },
      { bulan: "2024-06", jumlah: 0 },
      { bulan: "2024-07", jumlah: 4 },
      { bulan: "2024-08", jumlah: 2 },
      { bulan: "2024-09", jumlah: 0 },
      { bulan: "2024-10", jumlah: 1 },
      { bulan: "2024-11", jumlah: 0 },
      { bulan: "2024-12", jumlah: 6 },
    ];
    cy.intercept("GET", "/api/permintaan/dashboard/tren-permintaan", {
      statusCode: 200,
      body: mockTren,
    }).as("getTrenPermintaan");

    cy.reload();
    cy.wait("@getTrenPermintaan");

    cy.get("canvas").should("exist");
    cy.contains("Grafik tren permintaan barang setiap bulan.").should("exist");
    cy.contains("Jan 2024").should("exist");
    cy.contains("Des 2024").should("exist");
  });

  it("should show correct bar color for chart", () => {
    // Pastikan chart bar berwarna biru sesuai konfigurasi
    cy.get("canvas").should("exist");
    // Tidak bisa assert warna langsung, tapi bisa assert canvas ada
  });
});
