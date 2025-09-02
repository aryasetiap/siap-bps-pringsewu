describe("Riwayat Permintaan Barang - List Permintaan Pegawai", () => {
  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("budi");
    cy.get('input[name="password"]').type("budi123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/pegawai/permintaan");
    cy.visit("/pegawai/riwayat");
  });

  it("should show permintaan table and correct columns", () => {
    cy.contains("Riwayat Permintaan").should("exist");
    cy.get("table").should("exist");
    cy.get("th").contains("Nomor").should("exist");
    cy.get("th").contains("Tanggal").should("exist");
    cy.get("th").contains("Status").should("exist");
    cy.get("th").contains("Total Item").should("exist");
    cy.get("th").contains("Aksi").should("exist");
  });

  it("should show empty state if no permintaan", () => {
    cy.intercept("GET", "/api/permintaan/riwayat*", {
      statusCode: 200,
      body: [],
    }).as("getRiwayatEmpty");

    cy.reload();
    cy.wait("@getRiwayatEmpty");
    cy.contains("Belum Ada Riwayat Permintaan").should("exist");
    // Hapus assertion berikut karena "Tidak ada data permintaan" hanya muncul di tabel, bukan di empty state utama
    // cy.contains("Tidak ada data permintaan").should("exist");
  });

  it("should show list of permintaan if available", () => {
    const mockRiwayat = [
      {
        id: 101,
        nomor_permintaan: "#REQ101",
        status: "Menunggu",
        tanggal_permintaan: "2025-09-03T08:00:00.000Z",
        catatan: "Permintaan ATK bulanan",
        catatan_admin: "-",
        details: [
          {
            id: 1,
            barang: {
              nama_barang: "Barang Contoh 8",
              kode_barang: "BRG008",
              satuan: "rim",
            },
            jumlah_diminta: 10,
            jumlah_disetujui: 0,
          },
        ],
      },
      {
        id: 102,
        nomor_permintaan: "#REQ102",
        status: "Disetujui",
        tanggal_permintaan: "2025-09-04T08:00:00.000Z",
        catatan: "Permintaan printer",
        catatan_admin: "Disetujui oleh admin",
        details: [
          {
            id: 2,
            barang: {
              nama_barang: "Printer Inkjet",
              kode_barang: "BRG009",
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

    cy.contains("#REQ101").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.contains("#REQ102").should("exist");
    cy.contains("Disetujui").should("exist");
  });

  it("should filter permintaan by status", () => {
    const mockRiwayat = [
      {
        id: 103,
        nomor_permintaan: "#REQ103",
        status: "Menunggu",
        tanggal_permintaan: "2025-09-05T08:00:00.000Z",
        catatan: "Permintaan ATK",
        catatan_admin: "-",
        details: [
          {
            id: 3,
            barang: {
              nama_barang: "Pulpen Merah",
              kode_barang: "BRG010",
              satuan: "pcs",
            },
            jumlah_diminta: 5,
            jumlah_disetujui: 0,
          },
        ],
      },
      {
        id: 104,
        nomor_permintaan: "#REQ104",
        status: "Ditolak",
        tanggal_permintaan: "2025-09-06T08:00:00.000Z",
        catatan: "Permintaan barang ditolak",
        catatan_admin: "Stok habis, permintaan ditolak",
        details: [
          {
            id: 4,
            barang: {
              nama_barang: "Stapler",
              kode_barang: "BRG011",
              satuan: "pcs",
            },
            jumlah_diminta: 30,
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

    // Filter status "Menunggu"
    cy.get("select").contains("Menunggu").parent().select("Menunggu");
    cy.contains("#REQ103").should("exist");
    cy.contains("Menunggu").should("exist");
    cy.get("table").should("not.contain", "#REQ104");
    cy.get("table").should("not.contain", "Ditolak");

    // Filter status "Ditolak"
    cy.get("select").contains("Ditolak").parent().select("Ditolak");
    cy.contains("#REQ104").should("exist");
    cy.contains("Ditolak").should("exist");
    cy.get("table").should("not.contain", "#REQ103");
    cy.get("table").should("not.contain", "Menunggu");

    // Reset filter
    cy.get("select").contains("Semua Status").parent().select("");
    cy.contains("#REQ103").should("exist");
    cy.contains("#REQ104").should("exist");
  });

  it("should change limit per page", () => {
    // Buat mock data 30 permintaan
    const mockRiwayat = Array.from({ length: 30 }, (_, i) => ({
      id: 300 + i,
      nomor_permintaan: `#REQ${300 + i}`,
      status: "Menunggu",
      tanggal_permintaan: "2025-09-08T08:00:00.000Z",
      catatan: `Permintaan ke-${i}`,
      catatan_admin: "-",
      details: [
        {
          id: 20 + i,
          barang: {
            nama_barang: `Barang ${i}`,
            kode_barang: `BRG${20 + i}`,
            satuan: "pcs",
          },
          jumlah_diminta: 2 + i,
          jumlah_disetujui: 0,
        },
      ],
    }));

    cy.intercept("GET", "/api/permintaan/riwayat*", {
      statusCode: 200,
      body: mockRiwayat.slice(0, 5),
      meta: { totalPages: 6 },
    }).as("getRiwayatLimit5");

    cy.reload();
    cy.wait("@getRiwayatLimit5");

    cy.get("table tbody tr").should("have.length.at.most", 5);

    // Ubah limit ke 10
    cy.intercept("GET", "/api/permintaan/riwayat*", {
      statusCode: 200,
      body: mockRiwayat.slice(0, 10),
      meta: { totalPages: 3 },
    }).as("getRiwayatLimit10");

    cy.get("select").contains("10").parent().select("10");
    cy.wait("@getRiwayatLimit10");
    cy.get("table tbody tr").should("have.length.at.most", 10);

    // Ubah limit ke 25 (harusnya hanya 30 data tersedia)
    cy.intercept("GET", "/api/permintaan/riwayat*", {
      statusCode: 200,
      body: mockRiwayat.slice(0, 25),
      meta: { totalPages: 2 },
    }).as("getRiwayatLimit25");

    cy.get("select").contains("25").parent().select("25");
    cy.wait("@getRiwayatLimit25");
    cy.get("table tbody tr").should("have.length.at.most", 25);
  });
});
