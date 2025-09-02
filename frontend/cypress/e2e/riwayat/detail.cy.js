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

  it("should open detail modal and show correct information", () => {
    const mockRiwayat = [
      {
        id: 401,
        nomor_permintaan: "#REQ401",
        status: "Menunggu",
        tanggal_permintaan: "2025-09-10T08:00:00.000Z",
        catatan: "Permintaan ATK bulanan",
        catatan_admin: "-",
        details: [
          {
            id: 1,
            barang: {
              kode_barang: "BRG008",
              nama_barang: "Barang Contoh 8",
              satuan: "rim",
            },
            jumlah_diminta: 10,
            jumlah_disetujui: 0,
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

    // Klik tombol detail pada baris permintaan
    cy.get('button[title="Lihat Detail"]').first().click();

    // Modal detail harus muncul dan menampilkan data yang benar
    cy.contains("Detail Permintaan #REQ401").should("exist");
    cy.contains("Permintaan ATK bulanan").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.contains("Barang Contoh 8").should("exist");
    cy.contains("BRG008").should("exist");
    cy.contains("rim").should("exist");
    cy.contains("10").should("exist");

    // Tutup modal
    cy.get('button[aria-label="Close"]').click();
    cy.contains("Detail Permintaan #REQ401").should("not.exist");
  });

  it("should show correct table columns in detail modal", () => {
    const mockRiwayat = [
      {
        id: 402,
        nomor_permintaan: "#REQ402",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-11T08:00:00.000Z",
        catatan: "Permintaan printer",
        catatan_admin: "Disetujui oleh admin",
        tanggal_verifikasi: "2025-09-12T09:00:00.000Z",
        details: [
          {
            id: 2,
            barang: {
              kode_barang: "BRG009",
              nama_barang: "Printer Inkjet",
              satuan: "unit",
            },
            jumlah_diminta: 1,
            jumlah_disetujui: 1,
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

    // Cek kolom tabel barang di modal
    cy.get("table").should("exist");
    cy.get("th").contains("Kode").should("exist");
    cy.get("th").contains("Barang").should("exist");
    cy.get("th").contains("Diminta").should("exist");
    cy.get("th").contains("Disetujui").should("exist");
    cy.get("th").contains("Satuan").should("exist");

    // Tutup modal
    cy.get('button[aria-label="Close"]').click();
    cy.contains("Detail Permintaan #REQ402").should("not.exist");
  });

  it("should show admin note if status is not Menunggu", () => {
    const mockRiwayat = [
      {
        id: 403,
        nomor_permintaan: "#REQ403",
        status: "Ditolak",
        tanggal_permintaan: "2025-09-12T08:00:00.000Z",
        catatan: "Permintaan barang ditolak",
        catatan_admin: "Stok habis, permintaan ditolak",
        tanggal_verifikasi: "2025-09-13T09:00:00.000Z",
        details: [
          {
            id: 3,
            barang: {
              kode_barang: "BRG010",
              nama_barang: "Pulpen Merah",
              satuan: "pcs",
            },
            jumlah_diminta: 5,
            jumlah_disetujui: 0,
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

    cy.contains("Catatan Admin").should("exist");
    cy.contains("Stok habis, permintaan ditolak").should("exist");

    // Tutup modal
    cy.get('button[aria-label="Close"]').click();
    cy.contains("Detail Permintaan #REQ403").should("not.exist");
  });

  it("should close detail modal when clicking Tutup button", () => {
    const mockRiwayat = [
      {
        id: 404,
        nomor_permintaan: "#REQ404",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-13T08:00:00.000Z",
        catatan: "Permintaan barang disetujui",
        catatan_admin: "Disetujui oleh admin",
        tanggal_verifikasi: "2025-09-14T09:00:00.000Z",
        details: [
          {
            id: 4,
            barang: {
              kode_barang: "BRG011",
              nama_barang: "Stapler",
              satuan: "pcs",
            },
            jumlah_diminta: 2,
            jumlah_disetujui: 2,
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

    cy.contains("Detail Permintaan #REQ404").should("exist");
    cy.get("button").contains("Tutup").click();
    cy.contains("Detail Permintaan #REQ404").should("not.exist");
  });
});
