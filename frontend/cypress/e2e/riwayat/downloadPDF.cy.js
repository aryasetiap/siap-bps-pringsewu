describe("Riwayat Permintaan Barang - Detail Modal Pegawai", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");
    cy.visit("/pegawai/riwayat");
  });

  it("should show correct table columns in detail modal", () => {
    const mockRiwayat = [
      {
        id: 402,
        nomorPermintaan: "#REQ402",
        status: "Disetujui",
        tanggalPermintaan: "2025-09-11T08:00:00.000Z",
        catatan: "Permintaan printer",
        catatanAdmin: "Disetujui oleh admin",
        tanggalVerifikasi: "2025-09-12T09:00:00.000Z",
        items: [
          {
            id: 2,
            namaBarang: "Printer Inkjet",
            kodeBarang: "BRG009",
            satuan: "unit",
            jumlahDiminta: 1,
            jumlahDisetujui: 1,
          },
        ],
      },
    ];

    cy.intercept("GET", "/api/permintaan/riwayat*", {
      statusCode: 200,
      body: mockRiwayat,
    }).as("getRiwayat");

    cy.reload();
    cy.wait("@getRiwayat");

    cy.get('button[title="Lihat Detail"]').first().click();

    cy.get("table").should("exist");
    cy.get("th").contains("Kode").should("exist");
    cy.get("th").contains("Barang").should("exist");
    cy.get("th").contains("Diminta").should("exist");
    cy.get("th").contains("Disetujui").should("exist");
    cy.get("th").contains("Satuan").should("exist");

    cy.get('button[aria-label="Close"]').click();
    cy.contains("Detail Permintaan #REQ402").should("not.exist");
  });
});
