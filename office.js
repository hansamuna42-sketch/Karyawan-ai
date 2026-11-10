const STORAGE_KEY = "karyawanai-office";
const PRICE_PER_EMPLOYEE = 199000;
const MAX_EMPLOYEES = 20;

const ROLES = {
  stok: { title: "Staf Stok Gudang", icon: "📦",
    tasks: ["Mencatat barang masuk & keluar", "Memperbarui jumlah stok setiap hari", "Melakukan stock opname mingguan"],
    events: ["mencatat {n} barang masuk dari supplier", "memperbarui stok {n} SKU", "menyelesaikan stock opname rak {rak}"] },
  keuangan: { title: "Staf Laporan Keuangan", icon: "💰",
    tasks: ["Menyusun laporan keuangan harian & bulanan", "Mencatat pemasukan dan pengeluaran", "Rekonsiliasi kas dan rekening bank"],
    events: ["menyusun laporan laba-rugi hari ini", "mencatat {n} transaksi pengeluaran", "menyelesaikan rekonsiliasi kas"] },
  alert: { title: "Pemantau Stok Menipis", icon: "🚨", alert: true,
    tasks: ["Memantau batas minimum setiap barang", "Melaporkan stok yang menipis ke pemilik", "Menyarankan jumlah restock"],
    events: ["⚠️ melapor: stok “{item}” tinggal {low} unit, segera restock", "⚠️ melapor: “{item}” di bawah batas minimum, saran restock {n} unit"] },
  cs: { title: "Customer Service", icon: "💬",
    tasks: ["Membalas chat pelanggan 24/7", "Menangani komplain & retur", "Eskalasi kasus sulit ke tim manusia"],
    events: ["membalas {n} chat pelanggan", "menyelesaikan 1 komplain pengiriman", "menjawab pertanyaan harga “{item}”"] },
  admin: { title: "Admin Pesanan", icon: "🧾",
    tasks: ["Memproses pesanan masuk", "Membuat & mengirim invoice", "Mengecek status pembayaran"],
    events: ["memproses {n} pesanan baru", "mengirim {n} invoice", "mengonfirmasi pembayaran pesanan #{order}"] },
  sosmed: { title: "Admin Media Sosial", icon: "📱",
    tasks: ["Membuat jadwal konten mingguan", "Menulis caption & membalas komentar", "Melaporkan performa postingan"],
    events: ["menjadwalkan {n} konten minggu ini", "membalas {n} komentar Instagram", "menulis caption promo “{item}”"] },
  sales: { title: "Sales & Follow-up", icon: "🛒",
    tasks: ["Follow-up calon pembeli", "Menawarkan promo & bundling", "Mencatat prospek ke CRM"],
    events: ["follow-up {n} calon pembeli", "menutup penjualan pesanan #{order}", "mencatat {n} prospek baru"] },
  data: { title: "Analis Data Penjualan", icon: "📊",
    tasks: ["Menganalisis produk terlaris", "Membuat grafik tren penjualan", "Memberi rekomendasi strategi"],
    events: ["menemukan “{item}” sebagai produk terlaris minggu ini", "memperbarui grafik tren penjualan", "menyiapkan rekomendasi promo"] },
  pengiriman: { title: "Koordinator Pengiriman", icon: "🚚",
    tasks: ["Menjadwalkan pengiriman harian", "Membuat resi & melacak paket", "Mengabari pelanggan status kiriman"],
    events: ["membuat {n} resi pengiriman", "melacak paket pesanan #{order}", "mengabari {n} pelanggan status kiriman"] },
  jadwal: { title: "Penjadwal & Reservasi", icon: "📅",
    tasks: ["Mengatur janji temu & reservasi", "Mengirim pengingat jadwal", "Mengelola kalender tim"],
    events: ["mengonfirmasi {n} reservasi", "mengirim {n} pengingat jadwal", "menata ulang kalender besok"] },
  hr: { title: "Admin HR & Absensi", icon: "👥",
    tasks: ["Merekap absensi karyawan", "Menghitung lembur & gaji", "Mengingatkan jadwal shift"],
    events: ["merekap absensi hari ini", "menghitung lembur {n} karyawan", "mengirim jadwal shift minggu depan"] },
  bahan: { title: "Pengelola Bahan & Menu", icon: "🍳",
    tasks: ["Mencatat pemakaian bahan baku", "Menghitung HPP setiap menu", "Menyusun daftar belanja bahan"],
    events: ["mencatat pemakaian bahan {n} porsi", "memperbarui HPP menu “{item}”", "menyusun daftar belanja besok"] },
  rekam: { title: "Admin Rekam Medis", icon: "🩺",
    tasks: ["Mendata pasien baru", "Merapikan riwayat kunjungan", "Menyiapkan data untuk dokter"],
    events: ["mendata {n} pasien baru", "merapikan riwayat {n} kunjungan", "menyiapkan berkas pasien sesi sore"] },
};

const INDUSTRIES = {
  retail: { label: "🛍️ Toko / Retail", keys: ["toko", "retail", "online", "olshop", "ecommerce", "jual"],
    roles: ["stok", "keuangan", "alert", "cs", "admin", "sosmed", "data", "pengiriman", "sales", "hr"],
    items: ["Kaos Polos Hitam M", "Sepatu Sneakers 42", "Tas Ransel", "Jaket Hoodie L", "Topi Baseball"] },
  gudang: { label: "🏭 Gudang & Distribusi", keys: ["gudang", "distribusi", "distributor", "logistik", "grosir"],
    roles: ["stok", "keuangan", "alert", "pengiriman", "admin", "data", "cs", "hr", "sales", "sosmed"],
    items: ["Beras 5kg", "Minyak Goreng 2L", "Gula Pasir 1kg", "Air Mineral 600ml", "Mie Instan (dus)"] },
  fnb: { label: "🍜 Restoran / F&B", keys: ["restoran", "resto", "cafe", "kafe", "kuliner", "f&b", "makanan", "warung"],
    roles: ["bahan", "keuangan", "alert", "jadwal", "cs", "sosmed", "data", "hr", "admin", "sales"],
    items: ["Biji Kopi Arabika", "Susu UHT", "Ayam Fillet", "Gula Aren", "Nasi Goreng Spesial"] },
  klinik: { label: "🏥 Klinik / Kesehatan", keys: ["klinik", "kesehatan", "apotek", "dokter", "rumah sakit"],
    roles: ["jadwal", "rekam", "keuangan", "cs", "stok", "alert", "hr", "sosmed", "data", "admin"],
    items: ["Paracetamol 500mg", "Masker Medis", "Sarung Tangan Latex", "Vitamin C", "Alkohol Swab"] },
  jasa: { label: "💼 Jasa / Agensi", keys: ["jasa", "agensi", "agency", "konsultan", "service"],
    roles: ["cs", "sales", "jadwal", "keuangan", "admin", "sosmed", "data", "hr", "stok", "alert"],
    items: ["Paket Desain Logo", "Paket Konsultasi", "Paket Social Media", "Paket Website", "Paket Foto Produk"] },
  lainnya: { label: "✨ Lainnya", keys: ["lain"],
    roles: ["stok", "keuangan", "alert", "cs", "admin", "sosmed", "sales", "data", "jadwal", "hr"],
    items: ["Produk A", "Produk B", "Produk C", "Produk D", "Produk E"] },
};

const NAMES = ["Rina", "Bayu", "Citra", "Dimas", "Eka", "Fajar", "Gita", "Hendra", "Intan", "Joko", "Kirana", "Lukman",
  "Maya", "Nanda", "Oki", "Putri", "Raka", "Sari", "Tegar", "Ulfa", "Vina", "Wahyu", "Yuni", "Zaki", "Ayu", "Bagus",
  "Dewi", "Gilang", "Laras", "Reza"];
const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#ef4444", "#0ea5e9", "#84cc16", "#f97316"];

const $ = (id) => document.getElementById(id);
const chatLog = $("chatLog"), chips = $("chips"), chatInput = $("chatInput");
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

let state = load() || freshState();
let bossQueue = Promise.resolve();
let simTimer = null;

function freshState() {
  return { step: "company", company: "", industry: null, employees: [], approved: false };
}
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- Chat ---------- */
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function bubble(cls, html) {
  const el = document.createElement("div");
  el.className = `bubble bubble--${cls}`;
  el.innerHTML = html;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
  return el;
}
function userSays(text) { bubble("user", escapeHtml(text)); }

// Boss messages support **bold**; everything is escaped first.
function say(text, nextChips) {
  bossQueue = bossQueue.then(() => new Promise((resolve) => {
    setChips([]);
    const typing = bubble("boss", '<span class="typing"><span></span><span></span><span></span></span>');
    setTimeout(() => {
      typing.innerHTML = escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      chatLog.scrollTop = chatLog.scrollHeight;
      if (nextChips) setChips(nextChips);
      resolve();
    }, Math.min(400 + text.length * 4, 1200));
  }));
}

function setChips(list) {
  chips.innerHTML = "";
  list.forEach(([label, value]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.onclick = () => handle(value ?? label, label);
    chips.appendChild(b);
  });
}

const industryChips = () => Object.entries(INDUSTRIES).map(([k, v]) => [v.label, k]);
const countChips = () => ["1", "2", "3", "5", "8"].map((n) => [`${n} karyawan`, n]);
const reviewChips = () => [["✅ Setujui & mulai kerja", "setuju"], ["🔀 Acak ulang nama", "acak"], ["🔢 Ubah jumlah", "jumlah"], ["🏷️ Ganti bidang usaha", "bidang"]];
const doneChips = () => [["📋 Ringkasan tugas", "ringkasan"], ["➕ Tambah 1 karyawan", "tambah"], ["🔢 Ubah jumlah", "jumlah"]];

$("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  handle(text, text);
});

function handle(value, shown) {
  userSays(shown);
  const v = String(value).toLowerCase().trim();
  const num = parseInt(v.match(/\d+/)?.[0], 10);

  switch (state.step) {
    case "company":
      state.company = String(value).trim().slice(0, 60);
      state.step = "industry";
      save(); renderHeader();
      say(`Senang berkenalan dengan **${state.company}**! Bidang usahanya apa? Supaya saya bisa memilih peran karyawan yang paling cocok.`, industryChips());
      return;

    case "industry": {
      const key = matchIndustry(v);
      if (!key) return say("Maaf, saya belum menangkap bidang usahanya. Silakan pilih salah satu di bawah ya.", industryChips());
      state.industry = key;
      if (state.employees.length) {
        // Changing industry from review: reassign roles but keep names.
        state.employees = buildTeam(state.employees.length, state.employees.map((e) => e.name));
        state.step = "review"; save(); renderTeam();
        return say(`Bidang usaha diubah ke **${INDUSTRIES[key].label}**. Tugas tim sudah saya sesuaikan.\n\n${summary()}`, reviewChips());
      }
      state.step = "count"; save();
      say(`Siap, ${INDUSTRIES[key].label}. Pertanyaan pentingnya: **butuh berapa Karyawan AI?** (1–${MAX_EMPLOYEES})`, countChips());
      return;
    }

    case "count":
      if (!num || num < 1 || num > MAX_EMPLOYEES)
        return say(`Mohon isi angka antara 1 sampai ${MAX_EMPLOYEES} ya.`, countChips());
      resizeTeam(num);
      state.step = "review"; save(); renderTeam();
      say(`Baik, saya sudah menyiapkan **${num} Karyawan AI** untuk ${state.company}:\n\n${summary()}\n\nAnda bisa mengganti peran atau mengedit tugas langsung di kartu karyawan. Kalau sudah cocok, klik **Setujui**.`, reviewChips());
      return;

    case "review":
    case "done":
      return handleCommand(v, num);
  }
}

function handleCommand(v, num) {
  if (/\b(setuju|ok|oke|ya|lanjut|mulai|approve)\b/.test(v) && state.step === "review") {
    state.approved = true; state.step = "done"; save(); renderTeam(); startSim();
    return say(`Tim resmi bekerja mulai sekarang! 🎉 Saya akan memantau semua karyawan dan melaporkan aktivitas mereka di panel **Aktivitas Kantor**.\n\nEstimasi sewa: **${rupiah(state.employees.length * PRICE_PER_EMPLOYEE)}/bulan**.`, doneChips());
  }
  if (/acak/.test(v)) {
    const names = pickNames(state.employees.length);
    state.employees.forEach((e, i) => { e.name = names[i]; });
    save(); renderTeam();
    return say(`Nama sudah diacak ulang:\n\n${summary()}`, chipsForStep());
  }
  if (/bidang|industri|usaha/.test(v)) {
    state.step = "industry"; save();
    return say("Silakan pilih bidang usaha yang baru:", industryChips());
  }
  if (/tambah/.test(v)) {
    if (state.employees.length >= MAX_EMPLOYEES) return say(`Maksimal ${MAX_EMPLOYEES} karyawan per kantor.`, chipsForStep());
    resizeTeam(state.employees.length + 1);
    const e = state.employees.at(-1);
    save(); renderTeam();
    return say(`**${e.name}** bergabung sebagai **${ROLES[e.role].title}**:\n${e.tasks.map((t) => "• " + t).join("\n")}`, chipsForStep());
  }
  if (num >= 1 && num <= MAX_EMPLOYEES) {
    resizeTeam(num); save(); renderTeam();
    return say(`Jumlah tim sekarang **${num} karyawan**:\n\n${summary()}`, chipsForStep());
  }
  if (/jumlah/.test(v)) return say(`Mau jadi berapa karyawan? (1–${MAX_EMPLOYEES})`, countChips());
  if (/ringkas|tugas|daftar/.test(v)) return say(summary(), chipsForStep());
  say("Saya bisa membantu: setujui tim, acak ulang nama, ubah jumlah karyawan, tambah karyawan, atau tampilkan ringkasan tugas.", chipsForStep());
}

const chipsForStep = () => (state.step === "done" ? doneChips() : reviewChips());

function matchIndustry(v) {
  if (INDUSTRIES[v]) return v;
  return Object.entries(INDUSTRIES).find(([, ind]) => ind.keys.some((k) => v.includes(k)))?.[0] || null;
}

/* ---------- Team ---------- */
function pickNames(n, avoid = []) {
  const pool = NAMES.filter((x) => !avoid.includes(x)).sort(() => Math.random() - 0.5);
  return pool.slice(0, n);
}

function roleOrder() {
  const preferred = INDUSTRIES[state.industry].roles;
  return [...preferred, ...Object.keys(ROLES).filter((r) => !preferred.includes(r))];
}

function makeEmployee(name, index) {
  const order = roleOrder();
  const role = order[index % order.length];
  return { name, role, tasks: [...ROLES[role].tasks], color: COLORS[index % COLORS.length] };
}

function buildTeam(n, names) {
  return names.slice(0, n).map((name, i) => makeEmployee(name, i));
}

// Keeps existing employees (and their edits) when growing or shrinking the team.
function resizeTeam(n) {
  const current = state.employees.slice(0, n);
  const newNames = pickNames(n - current.length, current.map((e) => e.name));
  while (current.length < n) current.push(makeEmployee(newNames.shift(), current.length));
  state.employees = current;
}

function summary() {
  return state.employees.map((e, i) =>
    `${i + 1}. **${e.name}** — ${ROLES[e.role].icon} ${ROLES[e.role].title}\n${e.tasks.map((t) => "   • " + t).join("\n")}`
  ).join("\n\n");
}

function renderHeader() {
  $("companyLabel").textContent = state.company;
}

function renderTeam() {
  renderHeader();
  const team = $("team");
  const has = state.employees.length > 0;
  $("emptyState").hidden = has;
  $("costBox").hidden = !has;
  $("activity").hidden = !state.approved;
  team.classList.toggle("locked", state.approved);
  $("teamTitle").textContent = has ? `Tim ${state.company} · ${state.employees.length} Karyawan AI` : "Tim Anda";
  $("teamSubtitle").textContent = state.approved
    ? "Tim sedang bekerja. Pak Bima memantau semua aktivitas."
    : has ? "Draf tim — ubah peran atau tugas sebelum disetujui." : "Jawab pertanyaan Pak Bima untuk menyiapkan tim.";
  $("costValue").textContent = `${rupiah(state.employees.length * PRICE_PER_EMPLOYEE)}/bln`;

  team.innerHTML = "";
  state.employees.forEach((emp, idx) => team.appendChild(employeeCard(emp, idx)));
}

function employeeCard(emp, idx) {
  const card = document.createElement("article");
  card.className = "emp";
  card.dataset.idx = idx;

  const top = document.createElement("div");
  top.className = "emp__top";
  const av = document.createElement("div");
  av.className = "avatar";
  av.style.background = emp.color;
  av.textContent = emp.name.slice(0, 2).toUpperCase();
  const info = document.createElement("div");
  info.className = "emp__info";
  const name = document.createElement("div");
  name.className = "emp__name";
  name.textContent = `${ROLES[emp.role].icon} ${emp.name}`;
  const select = document.createElement("select");
  select.className = "emp__role";
  select.setAttribute("aria-label", `Peran ${emp.name}`);
  roleOrder().forEach((r) => select.add(new Option(ROLES[r].title, r, false, r === emp.role)));
  select.onchange = () => {
    emp.role = select.value;
    emp.tasks = [...ROLES[emp.role].tasks];
    save(); renderTeam();
    say(`Baik, **${emp.name}** sekarang bertugas sebagai **${ROLES[emp.role].title}**.`, chipsForStep());
  };
  const status = document.createElement("span");
  status.className = "emp__status" + (state.approved ? " emp__status--working" : "");
  status.textContent = state.approved ? "Bekerja" : "Menunggu";
  const nameRow = document.createElement("div");
  nameRow.className = "emp__namerow";
  nameRow.append(name, status);
  info.append(nameRow, select);
  top.append(av, info);

  const list = document.createElement("ul");
  emp.tasks.forEach((t, ti) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = t;
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "×";
    del.title = "Hapus tugas";
    del.onclick = () => { emp.tasks.splice(ti, 1); save(); renderTeam(); };
    li.append(span, del);
    list.appendChild(li);
  });

  const add = document.createElement("form");
  add.className = "emp__add";
  const input = document.createElement("input");
  input.placeholder = "Tambah tugas…";
  input.setAttribute("aria-label", `Tambah tugas untuk ${emp.name}`);
  const btn = document.createElement("button");
  btn.textContent = "+";
  add.append(input, btn);
  add.onsubmit = (e) => {
    e.preventDefault();
    const t = input.value.trim();
    if (!t) return;
    emp.tasks.push(t.slice(0, 120));
    save(); renderTeam();
  };

  card.append(top, list, add);
  return card;
}

/* ---------- Office simulation ---------- */
function startSim() {
  clearInterval(simTimer);
  if (!state.approved || !state.employees.length) return;
  tick();
  simTimer = setInterval(tick, 3000);
}

function tick() {
  const idx = randInt(0, state.employees.length - 1);
  const emp = state.employees[idx];
  const role = ROLES[emp.role];
  const text = rand(role.events)
    .replace("{n}", randInt(2, 30))
    .replace("{low}", randInt(1, 5))
    .replace("{rak}", rand(["A", "B", "C", "D"]))
    .replace("{order}", randInt(1000, 9999))
    .replace("{item}", rand(INDUSTRIES[state.industry].items));

  const li = document.createElement("li");
  if (role.alert) li.className = "alert";
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const b = document.createElement("b");
  b.textContent = emp.name;
  li.append(time, b, ` (${role.title}) ${text}`);
  const log = $("activityLog");
  log.prepend(li);
  while (log.children.length > 30) log.lastChild.remove();

  const pill = document.querySelector(`.emp[data-idx="${idx}"] .emp__status`);
  if (pill && role.alert) {
    pill.className = "emp__status emp__status--alert";
    pill.textContent = "Melapor";
    setTimeout(() => { pill.className = "emp__status emp__status--working"; pill.textContent = "Bekerja"; }, 2500);
  }
}

/* ---------- Boot ---------- */
$("resetBtn").addEventListener("click", () => {
  if (!confirm("Mulai ulang dan hapus tim saat ini?")) return;
  localStorage.removeItem(STORAGE_KEY);
  clearInterval(simTimer);
  state = freshState();
  chatLog.innerHTML = "";
  bossQueue = Promise.resolve();
  $("activityLog").innerHTML = "";
  renderTeam();
  greet();
});

function greet() {
  say("Halo! Saya **Pak Bima**, Kepala Pengelola Karyawan AI. 👋\nSaya akan menyiapkan tim karyawan digital untuk perusahaan Anda.");
  say("Pertama, apa nama perusahaan Anda?");
}

renderTeam();
if (state.step === "company") {
  greet();
} else {
  say(`Selamat datang kembali di kantor **${state.company}**! 👋`);
  if (state.step === "industry") say("Bidang usahanya apa?", industryChips());
  else if (state.step === "count") say("Butuh berapa Karyawan AI?", countChips());
  else say(summary(), chipsForStep());
  startSim();
}
