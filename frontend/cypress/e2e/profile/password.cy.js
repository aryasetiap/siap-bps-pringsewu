describe("Profile - Ubah Password", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/profile");
  });

  it("should show password form and validate input", () => {
    const mockProfile = {
      id: 1,
      nama: "Admin SIAP",
      username: "admin",
      unit_kerja: "Statistik Umum",
      role: "admin",
      foto: null,
      created_at: "2025-01-01T08:00:00.000Z",
    };

    cy.intercept("GET", "/api/user/profile", {
      statusCode: 200,
      body: mockProfile,
    }).as("getProfile");

    cy.reload();
    cy.wait("@getProfile");

    // Aktifkan tab Ubah Password
    cy.contains("Ubah Password").click();

    // Validasi password pendek
    cy.get('input[name="passwordBaru"]').type("123");
    cy.get('input[name="konfirmasi"]').type("123");
    cy.get('button[type="submit"]')
      .contains(/Ubah Password/i)
      .click();
    cy.contains("Password harus minimal 6 karakter").should("exist");

    // Validasi konfirmasi tidak cocok
    cy.get('input[name="passwordBaru"]').clear().type("passwordBaru123");
    cy.get('input[name="konfirmasi"]').clear().type("bedaPassword");
    cy.get('button[type="submit"]')
      .contains(/Ubah Password/i)
      .click();
    cy.contains("Konfirmasi password tidak cocok").should("exist");
  });

  it("should change password successfully", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 200,
      body: {
        id: 1,
        nama: "Admin SIAP",
        username: "admin",
        unit_kerja: "Statistik Umum",
        role: "admin",
        foto: null,
        created_at: "2025-01-01T08:00:00.000Z",
      },
    }).as("getProfile");

    cy.intercept("PATCH", "/api/user/profile", {
      statusCode: 200,
      body: {
        id: 1,
        nama: "Admin SIAP",
        username: "admin",
        unit_kerja: "Statistik Umum",
        role: "admin",
        foto: null,
        created_at: "2025-01-01T08:00:00.000Z",
      },
    }).as("changePassword");

    cy.reload();
    cy.wait("@getProfile");

    cy.contains("Ubah Password").click();
    cy.get('input[name="passwordBaru"]').type("passwordBaru123");
    cy.get('input[name="konfirmasi"]').type("passwordBaru123");
    cy.get('button[type="submit"]')
      .contains(/Ubah Password/i)
      .click();

    cy.wait("@changePassword");
    cy.contains("Password berhasil diubah!").should("exist");
  });

  it("should show error toast if API returns error", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 200,
      body: {
        id: 1,
        nama: "Admin SIAP",
        username: "admin",
        unit_kerja: "Statistik Umum",
        role: "admin",
        foto: null,
        created_at: "2025-01-01T08:00:00.000Z",
      },
    }).as("getProfile");

    cy.intercept("PATCH", "/api/user/profile", {
      statusCode: 400,
      body: { message: "Password tidak valid." },
    }).as("changePasswordError");

    cy.reload();
    cy.wait("@getProfile");

    cy.contains("Ubah Password").click();
    cy.get('input[name="passwordBaru"]').type("passwordBaru123");
    cy.get('input[name="konfirmasi"]').type("passwordBaru123");
    cy.get('button[type="submit"]')
      .contains(/Ubah Password/i)
      .click();

    cy.wait("@changePasswordError");
    cy.contains("Password tidak valid").should("exist");
  });
});
