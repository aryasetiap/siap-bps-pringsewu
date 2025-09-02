describe("Manajemen Barang - CRUD E2E", () => {
  let kodeUnik;
  let namaUnik;

  before(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/barang");

    // Generate kode unik sekali untuk semua test
    const timestamp = Date.now();
    kodeUnik = `BRG${timestamp}`;
    namaUnik = `Barang E2E ${timestamp}`;

    // Tambah barang baru sekali di awal
    cy.get("button").contains("Tambah Barang").click();
    cy.get('input[name="kode"]').type(kodeUnik);
    cy.get('input[name="nama"]').type(namaUnik);
    cy.get('select[name="kategori"]').select("ATK");
    cy.get('select[name="satuan"]').select("pcs");
    cy.get('input[name="stok"]').clear().type("10");
    cy.get('input[name="stokMinimum"]').clear().type("2");
    cy.get('textarea[name="deskripsi"]').type("Barang untuk testing E2E");
    cy.get('button[type="submit"]').click();
    cy.contains("Barang berhasil ditambahkan!").should("exist");
    cy.reload(); // Pastikan data barang terbaru muncul
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.contains(namaUnik).should("exist");
  });

  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.clearLocalStorage();
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/barang");
  });

  it("should show barang table and add button", () => {
    cy.contains("Manajemen Barang").should("exist");
    cy.get("button").contains("Tambah Barang").should("exist");
    cy.get("table").should("exist");
  });

  it("should add new barang", () => {
    // Generate kode unik baru untuk test ini
    const kodeBaru = `BRG${Date.now()}`;
    const namaBaru = `Barang E2E ${Date.now()}`;

    cy.get("button").contains("Tambah Barang").click();
    cy.get('input[name="kode"]').type(kodeBaru);
    cy.get('input[name="nama"]').type(namaBaru);
    cy.get('select[name="kategori"]').select("ATK");
    cy.get('select[name="satuan"]').select("pcs");
    cy.get('input[name="stok"]').clear().type("10");
    cy.get('input[name="stokMinimum"]').clear().type("2");
    cy.get('textarea[name="deskripsi"]').type("Barang untuk testing E2E");
    cy.get('button[type="submit"]').click();

    cy.contains("Barang berhasil ditambahkan!").should("exist");
    cy.reload();
    cy.scrollTo("bottom");
    cy.contains(kodeBaru, { timeout: 8000 }).should("exist");
    cy.contains(namaBaru).should("exist");
  });

  it("should edit barang", () => {
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.contains(kodeUnik)
      .parents("tr")
      .find("button[title='Edit Barang']")
      .click();
    cy.get('input[name="nama"]').clear().type(`${namaUnik} Updated`);
    cy.get('button[type="submit"]').click();

    cy.contains("Barang berhasil diupdate!").should("exist");
    cy.scrollTo("bottom");
    cy.contains(`${namaUnik} Updated`, { timeout: 8000 }).should("exist");
  });

  it("should add stock to barang", () => {
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.contains(kodeUnik)
      .parents("tr")
      .find("button[title='Tambah Stok']")
      .click();
    cy.get('input[name="jumlahTambah"]').clear().type("5");
    cy.get('button[type="submit"]').click();

    cy.contains("Stok barang berhasil ditambah!").should("exist");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik)
      .parents("tr")
      .contains(/15\s*pcs/);
  });

  it("should soft delete barang", () => {
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.contains(kodeUnik)
      .parents("tr")
      .find("button[title='Hapus Barang']")
      .click();
    cy.get("button").contains("Hapus").click();

    cy.contains("Barang berhasil dihapus!").should("exist");
    cy.get("select").eq(2).select("nonaktif");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).parents("tr").contains("Nonaktif");
  });

  it("should reactivate barang", () => {
    cy.get("select").eq(2).select("nonaktif");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.contains(kodeUnik)
      .parents("tr")
      .find("button")
      .contains("Aktifkan")
      .click();
    cy.contains("Barang berhasil diaktifkan kembali!").should("exist");
    cy.get("select").eq(2).select("aktif");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).parents("tr").contains("Aktif");
  });

  it("should filter barang by kategori and status", () => {
    cy.get("select").eq(0).select("ATK");
    cy.get("select").eq(2).select("aktif");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.get("select").eq(2).select("nonaktif");
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
  });

  it("should search barang by kode or nama", () => {
    cy.get("select").eq(2).select("aktif");
    cy.get('input[placeholder="Cari nama atau kode barang..."]').type(kodeUnik);
    cy.scrollTo("bottom");
    cy.contains(kodeUnik, { timeout: 8000 }).should("exist");
    cy.get('input[placeholder="Cari nama atau kode barang..."]')
      .clear()
      .type(`${namaUnik} Updated`);
    cy.scrollTo("bottom");
    cy.contains(`${namaUnik} Updated`, { timeout: 8000 }).should("exist");
  });
});
