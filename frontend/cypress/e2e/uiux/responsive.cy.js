describe("UI/UX - Responsive Design", () => {
  beforeEach(() => {
    // Login sebagai admin untuk akses penuh
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
  });

  describe("Mobile View (375px)", () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone 6/7/8 size
    });

    it("should show mobile sidebar as overlay", () => {
      // Sidebar desktop harus tersembunyi di mobile
      cy.get("[data-testid='desktop-sidebar']").should("not.be.visible");

      // Tombol toggle sidebar mobile harus terlihat
      cy.get("button[class*='md:hidden']").should("be.visible");

      // Klik toggle untuk membuka sidebar mobile
      cy.get("button[class*='md:hidden']").first().click();

      // Sidebar mobile overlay harus muncul
      cy.get("[data-testid='mobile-sidebar']").should("be.visible");
      cy.get("[data-testid='sidebar-title']").should("be.visible");
      cy.get("[data-testid='sidebar-subtitle']").should("be.visible");
    });

    it("should display responsive dashboard stats in single column", () => {
      // Stats cards harus dalam 1 kolom di mobile
      cy.get(".grid").should("have.class", "grid-cols-1");
      cy.contains("Total Barang").should("be.visible");
      cy.contains("Permintaan Tertunda").should("be.visible");
      cy.contains("Barang Kritis").should("be.visible");
      cy.contains("Total Pengguna").should("be.visible");
    });

    it("should show responsive table with horizontal scroll", () => {
      cy.visit("/admin/barang");

      // Tabel harus memiliki overflow-x-auto untuk scroll horizontal
      cy.get(".overflow-x-auto").should("exist");
      cy.get("table").should("be.visible");

      // Header tabel harus terlihat meski dalam mode scroll
      cy.get("th").contains("Kode").should("be.visible");
      cy.get("th").contains("Nama Barang").should("be.visible");
    });

    it("should display responsive form modal", () => {
      cy.visit("/admin/barang");
      cy.get("button").contains("Tambah Barang").click();

      // Modal harus responsive dan tidak overflow
      cy.get(".max-w-lg").should("be.visible");
      cy.get("input[name='kode']").should("be.visible");
      cy.get("input[name='nama']").should("be.visible");

      // Form harus menggunakan grid responsive
      cy.get(".grid").should("exist");
      cy.get(".md\\:grid-cols-2").should("exist");
    });
  });

  describe("Tablet View (768px)", () => {
    beforeEach(() => {
      cy.viewport(768, 1024); // iPad size
    });

    it("should show desktop sidebar with toggle button", () => {
      // Sidebar desktop harus terlihat
      cy.get("[data-testid='desktop-sidebar']").should("be.visible");

      // Tombol toggle collapse sidebar harus terlihat
      cy.get("button[class*='hidden md:block']").should("be.visible");

      // Klik untuk collapse sidebar
      cy.get("button[class*='hidden md:block']").click();

      // Sidebar harus menjadi sempit (w-20)
      cy.get(".w-20").should("exist");
    });

    it("should display responsive dashboard stats in 2 columns", () => {
      // Stats cards harus dalam 2 kolom di tablet
      cy.get(".sm\\:grid-cols-2").should("exist");
      cy.contains("Total Barang").should("be.visible");
      cy.contains("Permintaan Tertunda").should("be.visible");
    });

    it("should show responsive user management table", () => {
      cy.visit("/admin/pengguna");

      // Wait untuk data dimuat
      cy.get("table", { timeout: 10000 }).should("be.visible");

      // Cek header yang mungkin ada - gunakan contains yang lebih fleksibel
      cy.get("table").within(() => {
        // Cek salah satu dari kemungkinan header yang ada
        cy.get("th").should("contain.text", "Role"); // Role pasti ada
        cy.get("th").should("contain.text", "Aksi"); // Aksi pasti ada

        // Untuk nama, bisa "Nama", "Nama Lengkap", atau "Username"
        cy.get("th").then(($headers) => {
          const headerTexts = Array.from($headers).map((el) => el.textContent);
          const hasNamaHeader = headerTexts.some(
            (text) =>
              text.toLowerCase().includes("nama") ||
              text.toLowerCase().includes("username") ||
              text.toLowerCase().includes("pengguna")
          );
          expect(hasNamaHeader).to.be.true;
        });
      });
    });
  });

  describe("Desktop View (1366px)", () => {
    beforeEach(() => {
      cy.viewport(1366, 768); // Standard desktop
    });

    it("should show full desktop layout", () => {
      // Sidebar desktop harus terlihat penuh
      cy.get(".w-64").should("be.visible");

      // Content margin harus sesuai sidebar width
      cy.get(".md\\:ml-64").should("exist");

      // Header dengan user menu harus terlihat
      cy.get("header").should("be.visible");
      cy.contains("SIAP BPS Pringsewu").should("be.visible");
    });

    it("should display responsive dashboard stats in 4 columns", () => {
      // Stats cards harus dalam 4 kolom di desktop
      cy.get(".md\\:grid-cols-4").should("exist");

      // Semua stats harus terlihat dalam 1 baris
      cy.contains("Total Barang").should("be.visible");
      cy.contains("Permintaan Tertunda").should("be.visible");
      cy.contains("Barang Kritis").should("be.visible");
      cy.contains("Total Pengguna").should("be.visible");
    });

    it("should show full width table without scroll", () => {
      cy.visit("/admin/barang");

      // Tabel harus terlihat penuh tanpa horizontal scroll
      cy.get("table").should("be.visible");
      cy.get("th").contains("Kode").should("be.visible");
      cy.get("th").contains("Nama Barang").should("be.visible");
      cy.get("th").contains("Kategori").should("be.visible");
      cy.get("th").contains("Stok").should("be.visible");
      cy.get("th").contains("Aksi").should("be.visible");
    });

    it("should display responsive form modal with 2 columns", () => {
      cy.visit("/admin/pengguna");
      cy.get("button").contains("Tambah Pengguna").click();

      // Modal harus menggunakan grid 2 kolom di desktop
      cy.get(".md\\:grid-cols-2").should("exist");
      cy.get("input[name='nama']").should("be.visible");
      cy.get("input[name='username']").should("be.visible");
      cy.get("select[name='role']").should("be.visible");
    });
  });

  describe("Responsive Navigation & Interaction", () => {
    it("should work on mobile navigation", () => {
      cy.viewport(375, 667);

      // Buka sidebar mobile dengan force untuk menghindari overlay
      cy.get("button[class*='md:hidden']").first().click({ force: true });

      // Wait untuk sidebar mobile muncul
      cy.get("[data-testid='mobile-sidebar']").should("be.visible");

      // Navigasi ke halaman lain - gunakan selector di dalam mobile sidebar
      cy.get("[data-testid='mobile-sidebar']")
        .contains("Manajemen Barang")
        .click({ force: true });
      cy.url().should("include", "/admin/barang");

      // Wait untuk navigasi selesai dan sidebar mulai menutup
      cy.wait(500);

      // Sidebar harus tidak terlihat (bisa masih ada di DOM tapi tersembunyi)
      cy.get("[data-testid='mobile-sidebar']").should("not.be.visible");
    });

    it("should work on tablet sidebar collapse", () => {
      cy.viewport(768, 1024);

      // Toggle collapse sidebar
      cy.get("button[class*='hidden md:block']").click();

      // Sidebar harus collapse
      cy.get(".w-20").should("exist");

      // Toggle kembali untuk expand
      cy.get("button[class*='hidden md:block']").click();

      // Sidebar harus expand
      cy.get(".w-64").should("exist");
    });

    it("should maintain responsive behavior across page navigation", () => {
      cy.viewport(768, 1024);

      // Collapse sidebar
      cy.get("button[class*='hidden md:block']").click();
      cy.get(".w-20").should("exist");

      // Navigasi ke halaman lain
      cy.contains("Manajemen Barang").click();
      cy.url().should("include", "/admin/barang");

      // Sidebar state harus tetap collapsed
      cy.get(".w-20").should("exist");
    });
  });

  describe("Responsive Modal & Dialog", () => {
    it("should display modal properly on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/admin/barang");

      // Buka modal tambah barang
      cy.get("button").contains("Tambah Barang").click();

      // Modal harus responsive di mobile
      cy.get(".w-full.max-w-lg").should("be.visible");
      cy.get("input[name='kode']").should("be.visible");

      // Close modal dengan force untuk menghindari overlay issues
      cy.get("button[aria-label='Tutup']").click({ force: true });
      cy.get(".max-w-lg").should("not.exist");
    });

    it("should display modal properly on desktop", () => {
      cy.viewport(1366, 768);
      cy.visit("/admin/verifikasi");

      // Mock data permintaan untuk detail modal
      cy.intercept("GET", "**/api/permintaan/all*", {
        statusCode: 200,
        body: {
          data: [
            {
              id: 1,
              nomorPermintaan: "#REQ001",
              namaPemohon: "Test User",
              unitKerja: "Test Unit",
              status: "Menunggu",
              tanggalPermintaan: new Date().toISOString(),
              totalItem: 1,
              items: [],
            },
          ],
          total: 1,
        },
      }).as("getPermintaan");

      cy.reload();
      cy.wait("@getPermintaan");

      // Klik detail permintaan
      cy.get("button[title='Lihat Detail']").first().click();

      // Modal detail harus proper di desktop - gunakan selector yang lebih generic
      cy.get(".bg-white.rounded-2xl.shadow-2xl").should("be.visible");
      cy.contains("Detail Permintaan").should("be.visible");
    });
  });

  describe("Print Responsive Layout", () => {
    it("should apply print styles correctly", () => {
      cy.visit("/admin/permintaan/501/cetak");

      // Mock data permintaan
      cy.intercept("GET", "/api/permintaan/501", {
        statusCode: 200,
        body: {
          id: 501,
          nomor_permintaan: "#REQ501",
          status: "Disetujui",
          tanggal_permintaan: new Date().toISOString(),
          pemohon: { nama: "Test User", unitKerja: "Test Unit" },
          items: [],
        },
      }).as("getPermintaan");

      cy.wait("@getPermintaan");

      // Area print harus ada
      cy.get(".print-area").should("exist");

      // Elements dengan .no-print harus ada (akan hidden saat print)
      cy.get(".no-print").should("exist");
    });
  });
});
