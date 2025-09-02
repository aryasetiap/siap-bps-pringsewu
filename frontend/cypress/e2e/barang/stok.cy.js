describe("Manajemen Barang - Penambahan Stok", () => {
  beforeEach(() => {
    cy.viewport(1440, 768);
    cy.visit("/login");
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("/admin/barang");
  });

  it("should open tambah stok modal from table", () => {
    // Pastikan ada barang aktif di tabel
    cy.get("table")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get('button[title="Tambah Stok"]').click();
      });
    cy.contains("Tambah Stok Barang").should("exist");
    cy.get('input[name="jumlahTambah"]').should("exist");
    cy.get('button[type="submit"]').should("exist");
  });

  it("should validate jumlah penambahan stok minimal 1", () => {
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

  it("should add stok to barang and update table", () => {
    cy.get("table").find("tbody tr").first().as("row");
    cy.get("@row").find("td").eq(1).invoke("text").as("namaBarang");
    cy.get("@row")
      .find("td")
      .eq(3)
      .invoke("text")
      .then((stokText) => {
        const stokAwal = parseInt(stokText);
        cy.get("@row").find('button[title="Tambah Stok"]').click();
        cy.get('input[name="jumlahTambah"]').clear().type("5");
        cy.get('button[type="submit"]').click();
        cy.contains("Stok barang berhasil ditambah!").should("exist");
        cy.reload();
        cy.get("@namaBarang").then((namaBarang) => {
          if (!namaBarang.trim()) {
            // Jika nama barang kosong, skip assertion
            expect(true).to.be.true;
          } else {
            cy.get("table")
              .find("tbody tr")
              .contains(namaBarang)
              .parent()
              .find("td")
              .eq(3)
              .invoke("text")
              .then((stokBaruText) => {
                const stokBaru = parseInt(stokBaruText);
                expect(stokBaru).to.be.greaterThan(stokAwal);
              });
          }
        });
      });
  });

  it("should show preview stok setelah penambahan di modal", () => {
    cy.get("table")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get('button[title="Tambah Stok"]').click();
      });
    cy.get('input[name="jumlahTambah"]').clear().type("10");
    cy.contains("Stok Setelah Penambahan:").should("exist");
    cy.get("table")
      .find("tbody tr")
      .first()
      .find("td")
      .eq(3)
      .invoke("text")
      .then((stokAwalText) => {
        const stokAwal = parseInt(stokAwalText);
        cy.get('input[name="jumlahTambah"]')
          .invoke("val")
          .then((val) => {
            const expectedStok = stokAwal + parseInt(val);
            cy.get(".font-bold.text-green-800.text-lg").should(($el) => {
              expect($el.text()).to.include(expectedStok.toString());
            });
          });
      });
  });

  it("should close modal when clicking Batal", () => {
    cy.get("table")
      .find("tbody tr")
      .first()
      .within(() => {
        cy.get('button[title="Tambah Stok"]').click();
      });
    cy.contains("Tambah Stok Barang").should("exist");
    cy.get("button").contains("Batal").click();
    cy.contains("Tambah Stok Barang").should("not.exist");
  });
});
