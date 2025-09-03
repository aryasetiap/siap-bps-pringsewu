describe("Profile - Error Handling", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/profile");
  });

  it("should show error state if API returns 401 (unauthorized)", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 401,
      body: { message: "Sesi login telah berakhir. Silakan login kembali." },
    }).as("getProfile401");

    cy.reload();
    cy.wait("@getProfile401");

    // Pastikan redirect ke halaman login
    cy.url().should("include", "/login");
    // Pastikan pesan error muncul (toast atau di halaman login)
    cy.contains(/Sesi login telah berakhir|login/i).should("exist");
  });

  it("should show error state if API returns 403 (forbidden)", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 403,
      body: { message: "Anda tidak memiliki izin untuk mengakses data ini." },
    }).as("getProfile403");

    cy.reload();
    cy.wait("@getProfile403");

    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Anda tidak memiliki izin").should("exist");
    cy.get("button").contains("Coba Lagi").should("exist");
  });

  it("should show error state if API returns 404 (not found)", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 404,
      body: { message: "Data profil tidak ditemukan." },
    }).as("getProfile404");

    cy.reload();
    cy.wait("@getProfile404");

    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Data profil tidak ditemukan").should("exist");
    cy.get("button").contains("Coba Lagi").should("exist");
  });

  it("should show error state if API returns 500 (server error)", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 500,
      body: { message: "Terjadi kesalahan pada server" },
    }).as("getProfile500");

    cy.reload();
    cy.wait("@getProfile500");

    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Terjadi kesalahan pada server").should("exist");
    cy.get("button").contains("Coba Lagi").should("exist");
  });

  it("should show error state if network error occurs", () => {
    cy.intercept("GET", "/api/user/profile", { forceNetworkError: true }).as(
      "getProfileNetworkError"
    );

    cy.reload();
    cy.wait("@getProfileNetworkError");

    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Tidak dapat terhubung ke server").should("exist");
    cy.get("button").contains("Coba Lagi").should("exist");
  });
});
