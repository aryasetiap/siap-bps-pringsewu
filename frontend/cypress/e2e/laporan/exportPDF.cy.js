describe("Laporan Periodik - Ekspor PDF", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/laporan");
  });

  it("should show filter form and export PDF button", () => {
    cy.contains("Filter Laporan").should("exist");
    cy.get("button")
      .contains("Ekspor PDF")
      .should("exist")
      .and("not.be.disabled");
  });

  it("should trigger PDF export and show success toast", () => {
    // Set filter tanggal dan unit kerja
    cy.get('input[type="date"]').first().type("2025-09-01");
    cy.get('input[type="date"]').last().type("2025-09-30");
    cy.get("select").first().select(""); // Semua Unit Kerja

    // Mock PDF response
    cy.intercept("GET", "/api/barang/laporan-penggunaan/pdf*", {
      statusCode: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "attachment; filename=laporan_penggunaan.pdf",
      },
      body: "PDFDATA",
    }).as("exportPDF");

    // Klik tombol ekspor PDF
    cy.get("button").contains("Ekspor PDF").click();
    cy.wait("@exportPDF");

    // Cek toast sukses muncul
    cy.contains(
      /PDF berhasil diunduh|PDF diunduh oleh download manager/
    ).should("exist");
  });

  it("should show error toast if export PDF fails", () => {
    // Set filter tanggal dan unit kerja
    cy.get('input[type="date"]').first().type("2025-09-01");
    cy.get('input[type="date"]').last().type("2025-09-30");
    cy.get("select").first().select("");

    // Mock error response sebagai string agar frontend bisa membaca pesan error
    cy.intercept("GET", "/api/barang/laporan-penggunaan/pdf*", {
      statusCode: 400,
      body: "Gagal mengunduh PDF",
    }).as("exportPDFError");

    cy.get("button").contains("Ekspor PDF").click();
    cy.wait("@exportPDFError");

    cy.contains("Data tidak valid. Periksa kembali input Anda.").should(
      "exist"
    );
  });
});
