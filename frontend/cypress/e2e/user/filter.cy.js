describe("Manajemen Pengguna - Filter & Search", () => {
  let usernameUnik;
  let namaUnik;

  before(() => {
    cy.viewport(1440, 768);
    cy.clearLocalStorage();
    cy.visit("/login");
    cy.get('input[name="username"]').should("exist").type("admin");
    cy.get('input[name="password"]').should("exist").type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/pengguna");

    // Generate username unik sekali untuk semua test
    const timestamp = Date.now();
    usernameUnik = `user${timestamp}`;
    namaUnik = `Pengguna E2E ${timestamp}`;

    // Tambah user baru sekali di awal
    cy.get("button").contains("Tambah Pengguna").click();
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
    cy.get('input[name="username"]').should("exist").type("admin");
    cy.get('input[name="password"]').should("exist").type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/pengguna");
  });

  it("should filter user by role", () => {
    cy.get('select[name="filterRole"]').select("pegawai");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.get('select[name="filterRole"]').select("admin");
    cy.contains(namaUnik).should("not.exist");
  });

  it("should filter user by status aktif", () => {
    cy.get('select[name="filterStatus"]').select("aktif");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik).should("not.exist");
  });

  it("should combine filter role and status", () => {
    cy.get('select[name="filterRole"]').select("pegawai");
    cy.get('select[name="filterStatus"]').select("aktif");
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
    cy.get('select[name="filterStatus"]').select("nonaktif");
    cy.contains(namaUnik).should("not.exist");
  });

  it("should search user by nama", () => {
    cy.get('input[placeholder="Cari nama, username, atau unit kerja..."]').type(
      namaUnik
    );
    cy.contains(namaUnik, { timeout: 8000 }).should("exist");
  });

  it("should search user by username", () => {
    cy.get('input[placeholder="Cari nama, username, atau unit kerja..."]').type(
      usernameUnik
    );
    cy.contains(usernameUnik, { timeout: 8000 }).should("exist");
  });

  it("should search user by unit kerja", () => {
    cy.get('input[placeholder="Cari nama, username, atau unit kerja..."]').type(
      "Statistik Produksi"
    );
    cy.contains("Statistik Produksi", { timeout: 8000 }).should("exist");
  });

  it("should reset filter and show all users", () => {
    cy.get('select[name="filterRole"]').select("");
    cy.get('select[name="filterStatus"]').select("");
    cy.get(
      'input[placeholder="Cari nama, username, atau unit kerja..."]'
    ).clear();
    cy.get("table").find("tbody tr").should("have.length.greaterThan", 0);
  });
});
