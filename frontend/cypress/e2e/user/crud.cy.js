describe("Manajemen Pengguna - CRUD E2E", () => {
  let usernameUnik;
  let namaUnik;

  before(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/pengguna"); // <-- perbaiki di sini

    // Pastikan halaman sudah siap
    cy.contains("Manajemen Pengguna").should("exist");
    cy.get("button").contains("Tambah Pengguna").should("exist").click();

    // Generate username unik sekali untuk semua test
    const timestamp = Date.now();
    usernameUnik = `user${timestamp}`;
    namaUnik = `Pengguna E2E ${timestamp}`;

    // Tambah user baru sekali di awal
    cy.get('input[name="nama"]').type(namaUnik);
    cy.get('input[name="username"]').type(usernameUnik);
    cy.get('input[name="password"]').type("password123");
    cy.get('select[name="role"]').select("pegawai");
    cy.get('select[name="unitKerja"]').select("Statistik Produksi");
    cy.get('button[type="submit"]').click();
    cy.contains("Pengguna berhasil ditambahkan!").should("exist");
    cy.reload();
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.contains(usernameUnik).should("exist");
  });

  beforeEach(() => {
    cy.viewport(1366, 768);
    cy.clearLocalStorage();
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/pengguna"); // <-- perbaiki di sini
  });

  it("should show user table and add button", () => {
    cy.contains("Manajemen Pengguna").should("exist");
    cy.get("button").contains("Tambah Pengguna").should("exist");
    cy.get("table").should("exist");
  });

  it("should add new user", () => {
    const usernameBaru = `user${Date.now()}`;
    const namaBaru = `Pengguna Baru ${Date.now()}`;
    cy.get("button").contains("Tambah Pengguna").click();
    cy.get('input[name="nama"]').type(namaBaru);
    cy.get('input[name="username"]').type(usernameBaru);
    cy.get('input[name="password"]').type("password123");
    cy.get('select[name="role"]').select("pegawai");
    cy.get('select[name="unitKerja"]').select("Statistik Produksi");
    cy.get('button[type="submit"]').click();
    cy.contains("Pengguna berhasil ditambahkan!").should("exist");
    cy.reload();
    cy.contains(namaBaru, { timeout: 8000 }).should("exist");
    cy.contains(usernameBaru).should("exist");
  });

  it("should edit user", () => {
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.contains(namaUnik)
      .parents("tr")
      .find('button[title="Edit Pengguna"]')
      .click();
    cy.get('input[name="nama"]').clear().type(`${namaUnik} Updated`);
    cy.get('button[type="submit"]').click();
    cy.contains("Pengguna berhasil diupdate!").should("exist");
    cy.reload();
    cy.contains(`${namaUnik} Updated`, { timeout: 8000 }).should("exist");
  });

  it("should deactivate user", () => {
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.contains(namaUnik)
      .parents("tr")
      .find('button[title="Nonaktifkan"]')
      .click();
    cy.contains("Konfirmasi Nonaktifkan Pengguna").should("exist");
    cy.get("button").contains("Nonaktifkan").click();
    cy.contains("Status pengguna berhasil diubah!").should("exist");
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik, { timeout: 8000 })
      .parents("tr")
      .contains("Non-aktif");
  });

  it("should reactivate user", () => {
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.contains(namaUnik)
      .parents("tr")
      .find('button[title="Aktifkan"]')
      .click();
    cy.contains("Konfirmasi Aktifkan Pengguna").should("exist");
    cy.get("button").contains("Aktifkan").click();
    cy.contains("Status pengguna berhasil diubah!").should("exist");
    cy.get('select[name="filterStatus"]').select("aktif");
    cy.contains(namaUnik, { timeout: 8000 }).parents("tr").contains("Aktif");
  });

  it("should soft delete user", () => {
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.contains(namaUnik)
      .parents("tr")
      .find('button[title="Hapus Pengguna"]')
      .click();
    cy.contains("Konfirmasi Hapus Pengguna").should("exist");
    cy.get("button").contains("Hapus").click();
    cy.contains("Pengguna berhasil dihapus (nonaktif).").should("exist");
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik, { timeout: 8000 })
      .parents("tr")
      .contains("Non-aktif");
  });

  it("should filter user by role and status", () => {
    cy.get('select[name="filterRole"]').select("pegawai");
    cy.get('select[name="filterStatus"]').select("aktif");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
  });

  it("should search user by nama or username", () => {
    // Pastikan filter status di-reset agar user muncul
    cy.get('select[name="filterStatus"]').select("");
    cy.get('input[placeholder="Cari nama, username, atau unit kerja..."]').type(
      namaUnik
    );
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.get('input[placeholder="Cari nama, username, atau unit kerja..."]')
      .clear()
      .type(usernameUnik);
    cy.contains(usernameUnik, { timeout: 8000 }).should("exist");
  });
});
