describe("Dashboard Permintaan Terbaru", () => {
  beforeEach(() => {
    // Login sebagai admin sebelum setiap test
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show recent requests section on dashboard", () => {
    cy.contains("Permintaan Terbaru").should("exist");
    cy.get("h2").contains("Permintaan Terbaru").should("be.visible");
  });

  it("should show loading state when recent requests is loading", () => {
    cy.reload();
    cy.contains("Memuat data...").should("exist");
  });

  it("should show empty state if no recent requests", () => {
    cy.intercept("GET", "/api/permintaan/masuk", {
      statusCode: 200,
      body: [],
    }).as("getRecentRequestsEmpty");

    cy.reload();
    cy.wait("@getRecentRequestsEmpty");
    cy.contains("Belum ada permintaan masuk.").should("exist");
  });

  it("should show list of recent requests if available", () => {
    const recentRequests = [
      {
        id: 201,
        status: "Menunggu",
        tanggal_permintaan: "2024-07-10T09:00:00.000Z",
        catatan: "Permintaan ATK",
        pemohon: { nama: "Budi Santoso", unit_kerja: "Statistik" },
        details: [
          {
            id: 1,
            barang: {
              nama_barang: "Kertas A4",
              kode_barang: "BRG001",
              satuan: "rim",
            },
            jumlah_diminta: 2,
          },
          {
            id: 2,
            barang: {
              nama_barang: "Pulpen Biru",
              kode_barang: "BRG002",
              satuan: "pcs",
            },
            jumlah_diminta: 5,
          },
        ],
      },
      // ...data lain
    ];
    cy.intercept(
      {
        method: "GET",
        url: "/api/permintaan/masuk",
      },
      (req) => {
        req.reply({
          statusCode: 200,
          body: recentRequests,
        });
      }
    ).as("getRecentRequests");

    cy.reload();
    cy.wait("@getRecentRequests");

    // Assertion hanya untuk field yang memang tampil di list
    cy.get(".font-semibold.text-gray-900").contains("Budi Santoso");
    cy.get(".text-xs.text-gray-500").contains("Statistik");
    cy.get(".font-medium.text-gray-700").contains("Kertas A4");
    cy.get(".absolute.top-4.right-4").contains("Menunggu");
    // Hapus assertion berikut karena catatan tidak tampil di list
    // cy.contains("Permintaan ATK").should("exist");
  });

  it("should open detail modal when clicking Detail button", () => {
    const recentRequests = [
      {
        id: 201,
        status: "Menunggu",
        tanggal_permintaan: "2024-07-10T09:00:00.000Z",
        catatan: "Permintaan ATK",
        pemohon: { nama: "Budi Santoso", unit_kerja: "Statistik" },
        details: [
          {
            id: 1,
            barang: {
              nama_barang: "Kertas A4",
              kode_barang: "BRG001",
              satuan: "rim",
            },
            jumlah_diminta: 2,
          },
        ],
      },
    ];
    cy.intercept("GET", "/api/permintaan/masuk", {
      statusCode: 200,
      body: recentRequests,
    }).as("getRecentRequests");

    cy.reload();
    cy.wait("@getRecentRequests");

    cy.contains("Detail").click();
    cy.contains("Detail Permintaan").should("exist");
    cy.contains("Budi Santoso").should("exist");
    cy.contains("Statistik").should("exist");
    cy.contains("Kertas A4").should("exist");
    cy.contains("Permintaan ATK").should("exist");
    cy.get("button[aria-label='Tutup']").click();
    cy.contains("Detail Permintaan").should("not.exist");
  });
});
