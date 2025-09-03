describe("Profile - Edit Data Diri & Password", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/profile");
  });

  it("should show profile data and edit form", () => {
    // Mock profile data
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

    cy.contains("Profil Saya").should("exist");
    cy.get("h2").contains("Admin SIAP").should("exist");
    cy.get(".text-sm.font-medium.text-gray-500")
      .contains("@admin")
      .should("exist");
    cy.get("span.bg-purple-100.text-purple-800")
      .contains("Administrator")
      .should("exist");
    cy.get("p.text-gray-600.text-sm")
      .contains("Statistik Umum")
      .should("exist");
    cy.get('input[name="nama"]').should("have.value", "Admin SIAP");
    cy.get('input[name="unitKerja"]').should("have.value", "Statistik Umum");
  });

  it("should update nama and unit kerja", () => {
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
        nama: "Admin E2E Updated",
        username: "admin",
        unit_kerja: "Statistik Produksi",
        role: "admin",
        foto: null,
        created_at: "2025-01-01T08:00:00.000Z",
      },
    }).as("updateProfile");

    cy.reload();
    cy.wait("@getProfile");

    cy.get('input[name="nama"]').clear().type("Admin E2E Updated");
    cy.get('input[name="unitKerja"]').clear().type("Statistik Produksi");
    cy.get('button[type="submit"]')
      .contains(/Simpan|Update/i)
      .click();

    cy.wait("@updateProfile");
    cy.contains("Profil berhasil diperbarui!").should("exist");
  });

  it("should change password", () => {
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

    // Aktifkan tab password jika ada tab navigasi
    cy.contains("Ubah Password").click();

    cy.get('input[name="passwordBaru"]').type("passwordBaru123");
    cy.get('input[name="konfirmasi"]').type("passwordBaru123");
    cy.get('button[type="submit"]')
      .contains(/Ubah Password/i)
      .click();

    cy.wait("@changePassword");
    cy.contains("Password berhasil diubah!").should("exist");
  });

  it("should upload profile photo", () => {
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

    cy.intercept("PATCH", "/api/user/profile/foto", {
      statusCode: 200,
      body: {
        id: 1,
        nama: "Admin SIAP",
        username: "admin",
        unit_kerja: "Statistik Umum",
        role: "admin",
        foto: "https://dummyimage.com/128x128/007bff/ffffff.png&text=E2E",
        created_at: "2025-01-01T08:00:00.000Z",
      },
    }).as("uploadPhoto");

    cy.reload();
    cy.wait("@getProfile");

    // Simulasi upload file foto (input hidden, gunakan force: true)
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from("dummy"),
        fileName: "foto-e2e.png",
        mimeType: "image/png",
        lastModified: Date.now(),
      },
      { force: true }
    );

    cy.wait("@uploadPhoto");
    cy.contains("Foto profil berhasil diperbarui!").should("exist");
  });
});
