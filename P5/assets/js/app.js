function initNavToggle() {
  const toggleBtn = document.getElementById("nav-toggle-btn");
  const nav = document.querySelector("header nav");
  if (!toggleBtn || !nav) return;

  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.addEventListener("click", function () {
    const terbuka = nav.classList.toggle("nav-open");
    toggleBtn.setAttribute("aria-expanded", String(terbuka));
  });
}

function getTable() {
  return document.querySelector(".table-responsive table");
}

function namaData() {
  return window.location.pathname.includes("anggota") ? "anggota" : "buku";
}

function updateCounter() {
  const table = getTable();
  if (!table) return;

  let counter = document.getElementById("table-counter");
  if (!counter) {
    counter = document.createElement("p");
    counter.id = "table-counter";
    counter.className = "table-counter";
    const searchBox = document.querySelector(".search-box");
    if (searchBox) {
      searchBox.insertAdjacentElement("afterend", counter);
    } else {
      table.parentElement.insertAdjacentElement("beforebegin", counter);
    }
  }

  const rows = table.querySelectorAll("tbody tr");
  let tampil = 0;
  rows.forEach(function (row) {
    if (row.style.display !== "none") tampil++;
  });

  counter.textContent =
    "Menampilkan " + tampil + " dari " + rows.length + " " + namaData();
}

// ===== Konfirmasi hapus (front-end only) =====
function initHapusConfirm() {
  document.querySelectorAll(".btn-hapus").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const row = btn.closest("tr");
      const nama = row ? row.querySelector("td")?.textContent : "data ini";
      const yakin = confirm('Yakin ingin menghapus "' + nama + '"?');

      if (yakin && row) {
        row.remove();
        updateCounter(); 
      }
    });
  });
}

function initTableFilter() {
  const input = document.getElementById("search-input");
  const table = getTable();
  if (!input || !table) return;

  input.addEventListener("keyup", function () {
    const keyword = input.value.toLowerCase().trim();
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(function (row) {
      const sel = row.querySelector("td"); 
      const teks = sel ? sel.textContent.toLowerCase() : "";
      row.style.display = teks.includes(keyword) ? "" : "none";
    });

    updateCounter(); 
  });

  updateCounter(); 
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
  hapusError(input);
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = pesan;
  input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains("error")) {
    next.remove();
  }
}

const ATURAN_VALIDASI = [
  { selector: "[name='judul'], [name='nama']", wajib: true },
  { selector: "[name='pengarang']", wajib: true },
  {
    selector: "[name='tahun']",
    tipe: "angka",
    min: 1900,
    max: 2026,
    pesan: "Tahun harus di antara 1900-2026.",
  },
  {
    selector: "[name='stok']",
    tipe: "angka",
    min: 0,
    pesan: "Stok tidak boleh negatif.",
  },
  {
    selector: "[name='isbn']",
    pola: /^[0-9-]+$/,
    pesan: "ISBN hanya boleh berisi angka dan tanda hubung (-).",
  },
];

function cekAturan(field, aturan) {
  const nilai = field.value.trim();

  if (nilai === "") {
    return aturan.wajib || aturan.tipe === "angka"
      ? "Field ini wajib diisi."
      : "";
  }

  if (aturan.tipe === "angka") {
    const angka = parseInt(nilai, 10);
    if (
      isNaN(angka) ||
      (aturan.min !== undefined && angka < aturan.min) ||
      (aturan.max !== undefined && angka > aturan.max)
    ) {
      return aturan.pesan;
    }
  }

  if (aturan.pola && !aturan.pola.test(nilai)) {
    return aturan.pesan;
  }

  return "";
}

function initValidasiForm() {
  const form = document.getElementById("form-tambah");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    let valid = true;
    let fieldPertamaError = null;

    ATURAN_VALIDASI.forEach(function (aturan) {
      const field = form.querySelector(aturan.selector);
      if (!field) return; 

      const pesan = cekAturan(field, aturan);
      if (pesan) {
        tampilkanError(field, pesan);
        valid = false;
        if (!fieldPertamaError) fieldPertamaError = field;
      } else {
        hapusError(field);
      }
    });

    if (!valid) {
      e.preventDefault();
      fieldPertamaError.focus(); 
    }
  });
}

// ===== Titik masuk =====
document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initHapusConfirm();
  initTableFilter();
  initValidasiForm();
});