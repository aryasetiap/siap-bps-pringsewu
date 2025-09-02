describe("Proteksi Akses & Role SIAP", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // --- 1. Proteksi: Harus login untuk akses halaman dashboard/admin ---
  it("should redirect to login if accessing admin dashboard without login", () => {
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/login");
    cy.contains(/login/i);
  });

  it("should redirect to login if accessing pegawai permintaan without login", () => {
    cy.visit("/pegawai/permintaan");
    cy.url().should("include", "/login");
    cy.contains(/login/i);
  });

  // --- 2. Proteksi: Role tidak sesuai, redirect ke forbidden ---
  it("should show forbidden if pegawai accesses admin dashboard", () => {
    // Login sebagai pegawai
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");

    // Coba akses dashboard admin
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/forbidden");
    cy.contains(/akses ditolak/i);
    cy.contains(/logout/i);
  });

  it("should show forbidden if admin accesses pegawai permintaan", () => {
    // Login sebagai admin
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");

    // Coba akses permintaan pegawai
    cy.visit("/pegawai/permintaan");
    cy.url().should("include", "/forbidden");
    cy.contains(/akses ditolak/i);
    cy.contains(/logout/i);
  });

  // --- 3. Proteksi: Token invalid/expired, redirect ke login ---
  it("should redirect to login if token is invalid", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "invalidtoken");
      win.localStorage.setItem("userRole", "admin");
    });
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/login");
    cy.contains(/login/i);
  });

  // --- 4. Proteksi: Halaman tidak ditemukan, tampilkan error 404 ---
  it("should show 404 page for unknown route", () => {
    cy.visit("/halaman-tidak-ada");
    cy.contains("404");
    cy.contains(/halaman tidak ditemukan/i);
    cy.get("a")
      .contains(/ke beranda/i)
      .should("exist");
  });

  // --- 5. Proteksi: Logout dari forbidden page menghapus session ---
  it("should logout from forbidden page and redirect to login", () => {
    // Login sebagai pegawai
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");

    // Coba akses halaman admin
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/forbidden");
    cy.contains(/logout/i).click();
    cy.url().should("include", "/login");
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authToken")).to.be.null;
      expect(win.localStorage.getItem("userRole")).to.be.null;
    });
  });
});
