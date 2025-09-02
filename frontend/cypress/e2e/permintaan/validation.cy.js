describe("Validasi Permintaan Barang - Pegawai", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");
  });

  it("should show error if keranjang kosong saat submit", () => {
    cy.get("button").contains("Ajukan Permintaan").click();
    cy.contains("Pilih minimal satu barang!").should("exist");
  });

  it("should show error if jumlah < 1 saat submit", () => {
    cy.get("table")
      .find("tbody tr")
      .not(':contains("Tidak ada barang ditemukan")')
      .first()
      .within(() => {
        cy.contains("Tambah").should("exist").click();
      });
    cy.get('input[type="number"]').first().clear().type("0");
    cy.get("button").contains("Ajukan Permintaan").click();
    cy.contains("Jumlah untuk").should("exist");
  });

  it("should show error if jumlah > stok saat submit", () => {
    cy.get("table")
      .find("tbody tr")
      .not(':contains("Tidak ada barang ditemukan")')
      .first()
      .within(() => {
        cy.contains("Tambah").should("exist").click();
      });
    cy.get('input[type="number"]')
      .first()
      .invoke("attr", "max")
      .then((maxStok) => {
        const lebihStok = parseInt(maxStok) + 1;
        cy.get('input[type="number"]')
          .first()
          .clear()
          .type(lebihStok.toString());
        cy.get("button").contains("Ajukan Permintaan").click();
        cy.contains("Jumlah").should("exist");
        cy.contains("melebihi stok tersedia").should("exist");
      });
  });

  it("should show error if API gagal saat submit", () => {
    cy.get("table")
      .find("tbody tr")
      .not(':contains("Tidak ada barang ditemukan")')
      .first()
      .within(() => {
        cy.contains("Tambah").should("exist").click();
      });
    cy.get('input[type="number"]').first().clear().type("1");
    cy.intercept("POST", "/api/permintaan", {
      statusCode: 500,
      body: { message: "Terjadi kesalahan pada server" },
    }).as("postPermintaanError");
    cy.get("button").contains("Ajukan Permintaan").click();
    cy.get("button").contains("Kirim Permintaan").click();
    cy.contains("Terjadi kesalahan pada server").should("exist");
  });

  // Test yang lebih tepat untuk barang nonaktif
  it("should show pesan yang benar ketika tidak ada barang tersedia", () => {
    cy.intercept("GET", "/api/barang/available", {
      statusCode: 200,
      body: [], // Tidak ada barang tersedia
    }).as("getNoBarang");

    cy.reload();
    cy.wait("@getNoBarang");
    cy.get("table").contains("Tidak ada barang ditemukan").should("exist");
  });
});
