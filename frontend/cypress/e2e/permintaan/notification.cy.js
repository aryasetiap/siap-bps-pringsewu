describe("Dashboard Notifikasi Stok Kritis", () => {
  beforeEach(() => {
    // Login sebagai admin sebelum setiap test
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show notif kritis section on dashboard", () => {
    cy.contains("Notifikasi Stok Kritis").should("exist");
    cy.get("h2").contains("Notifikasi Stok Kritis").should("be.visible");
  });

  it("should show loading state when notif kritis is loading", () => {
    // Simulasikan loading dengan reload cepat
    cy.reload();
    cy.contains("Memuat data...").should("exist");
  });

  it("should show empty state if no barang kritis", () => {
    // Mock API response kosong
    cy.intercept("GET", "/api/barang/dashboard/notifikasi-stok-kritis", {
      statusCode: 200,
      body: [],
    }).as("getNotifKritisEmpty");

    cy.reload();
    cy.wait("@getNotifKritisEmpty");
    cy.contains("Tidak ada barang dengan stok kritis.").should("exist");
  });

  it("should show list of barang kritis if available", () => {
    // Mock API response dengan data barang kritis
    const kritisBarang = [
      {
        id: 101,
        nama_barang: "Kertas A4",
        kode_barang: "BRG001",
        satuan: "rim",
        stok: 5,
        ambang_batas_kritis: 10,
        deskripsi: "Kertas HVS ukuran A4, 80gsm",
      },
      {
        id: 102,
        nama_barang: "Pulpen Biru",
        kode_barang: "BRG002",
        satuan: "pcs",
        stok: 2,
        ambang_batas_kritis: 5,
        deskripsi: "Pulpen tinta biru, 0.5mm",
      },
    ];
    cy.intercept("GET", "/api/barang/dashboard/notifikasi-stok-kritis", {
      statusCode: 200,
      body: kritisBarang,
    }).as("getNotifKritis");

    cy.reload();
    cy.wait("@getNotifKritis");

    // Pastikan daftar barang kritis tampil
    kritisBarang.forEach((item) => {
      cy.contains(item.nama_barang).should("exist");
      cy.contains(item.kode_barang).should("exist");
      cy.contains(`Stok: ${item.stok}`).should("exist");
      cy.contains(`Minimum: ${item.ambang_batas_kritis}`).should("exist");
      cy.contains(item.deskripsi).should("exist");
    });
  });

  it("should highlight barang kritis with red color", () => {
    // Pastikan elemen barang kritis memiliki style merah
    cy.get(".text-red-700").should("exist");
    cy.get(".bg-red-100").should("exist");
  });
});
