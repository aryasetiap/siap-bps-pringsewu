describe("UI/UX - Loading State", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show loading spinner on dashboard statistik", () => {
    cy.intercept("GET", "/api/permintaan/dashboard/statistik*", (req) => {
      req.on("response", (res) => res.setDelay(1500));
      req.reply({ statusCode: 200, body: {} });
    }).as("getStats");

    cy.reload();
    cy.get(".animate-pulse").should("exist");
    cy.contains("Total Barang").should("exist");
  });

  it("should show loading spinner on dashboard tren permintaan", () => {
    cy.intercept("GET", "/api/permintaan/dashboard/tren-permintaan*", (req) => {
      req.on("response", (res) => res.setDelay(1500));
      req.reply({ statusCode: 200, body: [] });
    }).as("getTren");

    cy.reload();
    cy.get(".animate-pulse").should("exist");
    cy.contains("Tren Permintaan Bulanan").should("exist");
  });

  it("should show loading spinner on riwayat permintaan pegawai", () => {
    // Logout dari admin session terlebih dahulu
    cy.window().then((win) => {
      win.localStorage.removeItem("authToken");
      win.localStorage.removeItem("userRole");
      win.localStorage.removeItem("username");
    });

    // Login sebagai pegawai
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");

    cy.intercept("GET", "/api/permintaan/riwayat*", (req) => {
      req.on("response", (res) => res.setDelay(1500));
      req.reply({ statusCode: 200, body: [] });
    }).as("getRiwayat");

    cy.visit("/pegawai/riwayat");
    // Ubah assertion sesuai dengan teks loading yang ada di EmployeeHistory
    cy.contains("Memuat data riwayat permintaan").should("exist");
    cy.get(".animate-spin").should("exist");
    cy.contains("Riwayat Permintaan").should("exist");
  });

  it("should show loading spinner on cetak bukti permintaan", () => {
    cy.intercept("GET", "/api/permintaan/501*", (req) => {
      req.on("response", (res) => res.setDelay(1500));
      req.reply({ statusCode: 200, body: {} });
    }).as("getPermintaan");

    cy.visit("/admin/permintaan/501/cetak");
    cy.get(".animate-spin").should("exist");
    cy.contains("Cetak Bukti Permintaan").should("exist");
    cy.contains("Memuat data permintaan").should("exist");
  });

  it("should show loading spinner on laporan periodik", () => {
    cy.intercept("GET", "/api/barang/laporan-penggunaan*", (req) => {
      req.on("response", (res) => res.setDelay(1500));
      req.reply({ statusCode: 200, body: [] });
    }).as("getLaporan");

    cy.visit("/admin/laporan");
    cy.get("button").contains("Filter Data").click();
    cy.get(".animate-spin").should("exist");
    cy.contains("Memuat data laporan").should("exist");
  });
});
