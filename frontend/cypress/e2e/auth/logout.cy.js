describe("Logout E2E", () => {
  beforeEach(() => {
    // Login sebagai admin sebelum setiap test
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should logout from Headbar and redirect to login", () => {
    // Klik menu user di Headbar
    cy.get('[aria-label="user-menu"]').click({ force: true });
    cy.contains("Keluar").click({ force: true });

    // Pastikan redirect ke halaman login
    cy.url().should("include", "/login");

    // Pastikan localStorage sudah dibersihkan
    cy.window().then((win) => {
      expect(win.localStorage.getItem("authToken")).to.be.null;
      expect(win.localStorage.getItem("userRole")).to.be.null;
      expect(win.localStorage.getItem("username")).to.be.null;
    });
  });

  it("should not access dashboard after logout", () => {
    // Logout
    cy.get('[aria-label="user-menu"]').click({ force: true });
    cy.contains("Keluar").click({ force: true });

    // Coba akses dashboard lagi
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/login");
  });

  it("should logout from Forbidden page", () => {
    // Simulasikan akses forbidden
    cy.visit("/forbidden");
    cy.get("button").contains("Logout").click();

    // Pastikan redirect ke login
    cy.url().should("include", "/login");
  });

  it("should call backend /auth/logout and blacklist token", () => {
    // Spy request ke backend
    cy.intercept("POST", "/api/auth/logout").as("logoutApi");

    // Logout
    cy.get('[aria-label="user-menu"]').click({ force: true });
    cy.contains("Keluar").click({ force: true });

    // Pastikan request ke backend terjadi
    cy.wait("@logoutApi").its("response.statusCode").should("eq", 201);
    cy.get("@logoutApi")
      .its("response.body.message")
      .should("match", /Logout/);
  });
});
