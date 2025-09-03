describe("Profile - View Data Diri", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/profile");
  });

  it("should show profile header and user info", () => {
    const mockProfile = {
      id: 1,
      nama: "Admin SIAP",
      username: "admin",
      unit_kerja: "Statistik Umum",
      role: "admin",
      foto: "https://dummyimage.com/128x128/007bff/ffffff.png&text=A",
      created_at: "2025-01-01T08:00:00.000Z",
    };

    cy.intercept("GET", "/api/user/profile", {
      statusCode: 200,
      body: mockProfile,
    }).as("getProfile");

    cy.reload();
    cy.wait("@getProfile");

    // Header dan nama
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

    // Foto profil
    cy.get('img[alt="Admin SIAP"]').should(
      "have.attr",
      "src",
      mockProfile.foto
    );

    // Form edit profil
    cy.get('input[name="nama"]').should("have.value", "Admin SIAP");
    cy.get('input[name="unitKerja"]').should("have.value", "Statistik Umum");
    cy.get('button[type="submit"]')
      .contains(/Simpan|Update/i)
      .should("exist");
  });

  it("should show default avatar if foto is null", () => {
    const mockProfile = {
      id: 2,
      nama: "Pegawai Dummy",
      username: "pegawai1",
      unit_kerja: "Statistik Distribusi",
      role: "pegawai",
      foto: null,
      created_at: "2025-01-02T08:00:00.000Z",
    };

    cy.intercept("GET", "/api/user/profile", {
      statusCode: 200,
      body: mockProfile,
    }).as("getProfile");

    cy.reload();
    cy.wait("@getProfile");

    cy.get("h2").contains("Pegawai Dummy").should("exist");
    cy.get(".text-sm.font-medium.text-gray-500")
      .contains("@pegawai1")
      .should("exist");
    cy.get("span.bg-green-100.text-green-800")
      .contains("Pegawai")
      .should("exist");
    cy.get("p.text-gray-600.text-sm")
      .contains("Statistik Distribusi")
      .should("exist");

    // Default avatar (initial)
    cy.get(".w-full.h-full.rounded-full.bg-gradient-to-r")
      .contains("P")
      .should("exist");
  });

  it("should show loading state when fetching profile", () => {
    cy.intercept("GET", "/api/user/profile", (req) => {
      req.on("response", (res) => {
        res.setDelay(1500);
      });
      req.reply({
        statusCode: 200,
        body: {},
      });
    }).as("getProfile");

    cy.reload();
    cy.contains("Memuat data profil...").should("exist");
  });

  it("should show error state if API fails", () => {
    cy.intercept("GET", "/api/user/profile", {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("getProfile");

    cy.reload();
    cy.contains("Gagal Memuat Data").should("exist");
    cy.contains("Internal Server Error").should("exist");
    cy.get("button").contains("Coba Lagi").should("exist");
  });
});
