describe("Login Page E2E", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.clearLocalStorage();
  });

  it("should show login form", () => {
    cy.get('input[name="username"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('button[type="submit"]').contains(/masuk/i);
  });

  it("should show validation error if fields empty", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Username wajib diisi");
    cy.contains("Password wajib diisi");
  });

  it("should show error for short password", () => {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("123");
    cy.get('button[type="submit"]').click();
    cy.contains("Password minimal 6 karakter");
  });

  it("should fail login with wrong password", () => {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();
    cy.contains(/username atau password salah|login gagal/i);
  });

  it("should fail login for non-existent user", () => {
    cy.get('input[name="username"]').type("nouser");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.contains(/username atau password salah|login gagal/i);
  });

  it("should login as admin and redirect to dashboard", () => {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/admin/dashboard");
    cy.contains(/dashboard/i);
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authToken")).to.exist;
      expect(win.localStorage.getItem("userRole")).to.eq("admin");
    });
  });

  it("should login as pegawai and redirect to permintaan", () => {
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/pegawai/permintaan");
    cy.contains(/permintaan/i);
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authToken")).to.exist;
      expect(win.localStorage.getItem("userRole")).to.eq("pegawai");
    });
  });

  it("should show error for nonaktif user", () => {
    cy.get('input[name="username"]').type("nonaktif");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.contains(
      /akun anda tidak aktif|username atau password salah|login gagal/i
    );
  });

  it("should redirect to dashboard if already logged in as admin", () => {
    cy.loginApi("admin", "admin123");
    cy.url().should("include", "/admin/dashboard");
  });

  it("should redirect to permintaan if already logged in as pegawai", () => {
    cy.loginApi("budi", "budi123");
    cy.url().should("include", "/pegawai/permintaan");
  });
});
