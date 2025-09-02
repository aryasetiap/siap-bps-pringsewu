describe("Dashboard Statistik", () => {
  beforeEach(() => {
    // Login sebagai admin sebelum setiap test
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show statistik section on dashboard", () => {
    cy.contains("Dashboard Admin").should("exist");
    cy.get("h1").contains("Dashboard Admin").should("be.visible");
    cy.contains(
      "Statistik, grafik, dan notifikasi stok kritis barang persediaan"
    ).should("exist");
    cy.contains("Total Barang").should("exist");
    cy.contains("Permintaan Tertunda").should("exist");
    cy.contains("Barang Kritis").should("exist");
    cy.contains("Total Pengguna").should("exist");
  });

  it("should show loading state when statistik is loading", () => {
    // Simulasikan loading dengan reload cepat
    cy.reload();
    cy.get(".animate-pulse").should("exist");
  });

  it("should show correct statistik values from API", () => {
    // Mock API response statistik dashboard
    const statsMock = {
      totalBarang: 12,
      totalPermintaanTertunda: 3,
      totalBarangKritis: 2,
      totalUser: 7,
    };
    cy.intercept("GET", "/api/permintaan/dashboard/statistik", {
      statusCode: 200,
      body: statsMock,
    }).as("getStats");

    cy.reload();
    cy.wait("@getStats");

    cy.contains("Total Barang").parent().contains(statsMock.totalBarang);
    cy.contains("Permintaan Tertunda")
      .parent()
      .contains(statsMock.totalPermintaanTertunda);
    cy.contains("Barang Kritis").parent().contains(statsMock.totalBarangKritis);
    cy.contains("Total Pengguna").parent().contains(statsMock.totalUser);
  });

  it("should show empty state if statistik is zero", () => {
    // Mock API response statistik dashboard dengan semua nilai nol
    const statsZero = {
      totalBarang: 0,
      totalPermintaanTertunda: 0,
      totalBarangKritis: 0,
      totalUser: 0,
    };
    cy.intercept("GET", "/api/permintaan/dashboard/statistik", {
      statusCode: 200,
      body: statsZero,
    }).as("getStatsZero");

    cy.reload();
    cy.wait("@getStatsZero");

    cy.contains("Total Barang").parent().contains("0");
    cy.contains("Permintaan Tertunda").parent().contains("0");
    cy.contains("Barang Kritis").parent().contains("0");
    cy.contains("Total Pengguna").parent().contains("0");
  });

  it("should show correct color for each statistik card", () => {
    // Pastikan setiap card statistik memiliki warna yang sesuai
    cy.get(".text-blue-700").should("exist"); // Total Barang
    cy.get(".text-yellow-700").should("exist"); // Permintaan Tertunda
    cy.get(".text-red-700").should("exist"); // Barang Kritis
    cy.get(".text-green-700").should("exist"); // Total Pengguna
  });
});
