describe("UI/UX - Toast Notification", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("should show success toast when adding barang", () => {
    cy.visit("/admin/barang");
    cy.get("button").contains("Tambah Barang").click();
    cy.get('input[name="kode"]').type(`BRG${Date.now()}`);
    cy.get('input[name="nama"]').type(`Barang Toast Test`);
    cy.get('.barang-form-modal select[name="kategori"]').select("ATK");
    cy.get('.barang-form-modal select[name="satuan"]').select("pcs");
    cy.get('input[name="stok"]').clear().type("10");
    cy.get('input[name="stokMinimum"]').clear().type("2");
    cy.get('textarea[name="deskripsi"]').type("Barang untuk toast test");
    cy.get('button[type="submit"]').click();
    cy.contains("Barang berhasil ditambahkan!").should("exist");
  });

  it("should show success toast when adding stock", () => {
    cy.visit("/admin/barang");
    cy.get("table")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get('button[title="Tambah Stok"]').click();
      });
    cy.get('input[name="jumlahTambah"]').clear().type("5");
    cy.get('button[type="submit"]').click();
    cy.contains("Stok barang berhasil ditambah!").should("exist");
  });

  it("should show error toast when adding stock with invalid jumlah", () => {
    cy.visit("/admin/barang");
    cy.get("table")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get('button[title="Tambah Stok"]').click();
      });
    cy.get('input[name="jumlahTambah"]').clear().type("0");
    cy.get('button[type="submit"]').click();
    cy.contains("Jumlah penambahan harus angka bulat positif!").should("exist");
  });

  it("should show success toast when exporting laporan PDF", () => {
    cy.visit("/admin/laporan");
    cy.get('input[type="date"]').first().type("2025-09-01");
    cy.get('input[type="date"]').last().type("2025-09-30");
    cy.get("select").first().select(""); // Semua Unit Kerja

    cy.intercept("GET", "/api/barang/laporan-penggunaan/pdf*", {
      statusCode: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "attachment; filename=laporan_penggunaan.pdf",
      },
      body: "PDFDATA",
    }).as("exportPDF");

    cy.get("button").contains("Ekspor PDF").click();
    cy.wait("@exportPDF");
    cy.contains(
      /PDF berhasil diunduh|PDF diunduh oleh download manager/
    ).should("exist");
  });

  it("should show error toast when export PDF fails", () => {
    cy.visit("/admin/laporan");
    cy.get('input[type="date"]').first().type("2025-09-01");
    cy.get('input[type="date"]').last().type("2025-09-30");
    cy.get("select").first().select("");

    cy.intercept("GET", "/api/barang/laporan-penggunaan/pdf*", {
      statusCode: 400,
      body: "Data tidak valid. Periksa kembali input Anda.",
    }).as("exportPDFError");

    cy.get("button").contains("Ekspor PDF").click();
    cy.wait("@exportPDFError");
    cy.contains("Data tidak valid. Periksa kembali input Anda.").should(
      "exist"
    );
  });

  it("should show success toast when downloading bukti permintaan PDF", () => {
    const mockPermintaan = {
      id: 501,
      nomor_permintaan: "#REQ501",
      status: "Disetujui",
      tanggal_permintaan: "2025-09-15T08:00:00.000Z",
      catatan_admin: "Disetujui oleh admin",
      pemohon: {
        nama: "Budi Santoso",
        unitKerja: "Statistik Produksi",
      },
      items: [
        {
          id: 1,
          barang: {
            nama_barang: "Kertas A4",
            kode_barang: "BRG001",
            satuan: "rim",
          },
          jumlah_diminta: 2,
          jumlah_disetujui: 2,
        },
      ],
    };

    cy.intercept("GET", "/api/permintaan/501", {
      statusCode: 200,
      body: mockPermintaan,
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/501/pdf", {
      statusCode: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition":
          "attachment; filename=Bukti_Permintaan_REQ501.pdf",
      },
      body: "PDFDATA",
    }).as("downloadPDF");

    cy.visit("/admin/permintaan/501/cetak");
    cy.wait("@getPermintaan");
    cy.get("button")
      .contains(/Unduh PDF/i)
      .click();
    cy.wait("@downloadPDF");
    cy.contains("PDF berhasil diunduh").should("exist");
  });

  it("should show error toast when bukti permintaan PDF download fails", () => {
    cy.intercept("GET", "/api/permintaan/502", {
      statusCode: 200,
      body: {
        id: 502,
        nomor_permintaan: "#REQ502",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-16T08:00:00.000Z",
        catatan_admin: "Disetujui oleh admin",
        pemohon: { nama: "Sari Dewi", unitKerja: "Statistik Distribusi" },
        items: [],
      },
    }).as("getPermintaan");

    cy.intercept("GET", "/api/permintaan/502/pdf", {
      statusCode: 500,
      body: "Gagal mengunduh PDF",
    }).as("downloadPDFError");

    cy.visit("/admin/permintaan/502/cetak");
    cy.wait("@getPermintaan");
    cy.get("button")
      .contains(/Unduh PDF/i)
      .click();
    cy.wait("@downloadPDFError");
    cy.contains(/Gagal mengunduh PDF/i).should("exist");
  });
});
