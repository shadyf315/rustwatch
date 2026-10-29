let servers = [
  { id: 1, name: "BLACK RUST | ЛАМПОВЫЙ | X2 | MAX 4", type: "modded", region: "RU", players: 7, max: 450, map: "Procedural Map", address: "85.115.160.28:28015", profileUrl: "https://wargm.ru/server/76438", website: "", badge: "BR", style: "orange", online: true },
  { id: 2, name: "[RU] RUST ROOM BUILD 2.0 | CREATIVE & SANDBOX", type: "community", region: "RU", players: 167, max: 504, map: "Custom Map", address: "185.189.255.232:28015", profileUrl: "https://wargm.ru/server/82226", website: "https://rustroombuild.com/", badge: "RR", style: "blue", online: true },
  { id: 3, name: "MIRAGE RUST | MAIN 2X | VANILLA+", type: "vanilla", region: "EU", players: 29, max: 500, map: "—", address: "185.189.255.143:35000", profileUrl: "https://wargm.ru/server/77226", website: "https://miragerust.com/", badge: "MR", style: "orange", online: true },
  { id: 4, name: "Rustafied.com — EU Main", type: "vanilla", region: "EU", players: 43, max: 100, map: "Rustafied Custom Map", address: "195.60.166.128:28015", profileUrl: "https://wargm.ru/server/70939", website: "https://www.rustafied.com/server", badge: "RF", style: "blue", online: true },
  { id: 5, name: "MIRAGE RUST | TUESDAY 2X | VANILLA+", type: "vanilla", region: "EU", players: 455, max: 1600, map: "—", address: "80.242.59.180:35000", profileUrl: "https://wargm.ru/server/80081", website: "", badge: "MR", style: "orange", online: true },
  { id: 6, name: "РОССИЯ X2 | THIS IS RUST!", type: "modded", region: "RU", players: 41, max: 100, map: "—", address: "37.230.162.79:28015", profileUrl: "https://wargm.ru/server/73593", website: "https://thisisrust.ru", badge: "TR", style: "blue", online: true },
  { id: 7, name: "Magic Rust — Main | Классика x1", type: "vanilla", region: "RU", players: 34, max: 100, map: "—", address: "185.207.214.136:10000", profileUrl: "https://wargm.ru/server/75192", website: "https://magicrust.gg", badge: "M", style: "orange", online: true },
  { id: 8, name: "Rusty Moose | US Mondays", type: "vanilla", region: "US", players: 704, max: 725, map: "Moose Maps", address: "205.178.168.77:28010", profileUrl: "https://wargm.ru/server/66130", website: "https://moose.gg/ssm/", badge: "RM", style: "blue", online: true },
  { id: 9, name: "Magic Rust #15 — Modded 2X | No Limit", type: "modded", region: "RU", players: 136, max: 170, map: "—", address: "185.207.214.27:20000", profileUrl: "https://wargm.ru/server/75181", website: "https://magicrust.gg", badge: "M", style: "orange", online: true },
  { id: 10, name: "RUSTBURG.GG #1 | X5/X10 | MAX 5", type: "modded", region: "RU", players: 52, max: 100, map: "FPS+", address: "194.93.2.53:11000", profileUrl: "https://wargm.ru/server/81064", website: "", badge: "RB", style: "blue", online: true },
  { id: 11, name: "Magic Rust #7 — Modded 2X | Solo/Duo/Trio", type: "modded", region: "RU", players: 48, max: 100, map: "—", address: "185.207.214.22:10000", profileUrl: "https://wargm.ru/server/75174", website: "https://magicrust.gg", badge: "M", style: "orange", online: true },
  { id: 12, name: "#3 BroRust X50/X100 | MAX 5", type: "modded", region: "RU", players: 73, max: 100, map: "BroRust Procedural", address: "109.248.4.156:28015", profileUrl: "https://wargm.ru/server/59704", website: "", badge: "BR", style: "blue", online: true }
];

const typeLabels = { vanilla: "VANILLA", modded: "MODDED", community: "COMMUNITY" };
const state = { category: "all", region: "all", query: "", onlineOnly: false, favoritesOnly: false, sort: "players", limit: 20, favorites: new Set(JSON.parse(localStorage.getItem("rustwatch-favorites") || "[]")) };
const list = document.querySelector("#server-list");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function filteredServers() {
  return servers.filter(server => {
    const matchesCategory = state.category === "all" || server.type === state.category;
    const matchesRegion = state.region === "all" || server.region === state.region;
    const matchesQuery = `${server.name} ${server.map} ${server.region}`.toLowerCase().includes(state.query.toLowerCase());
    return matchesCategory && matchesRegion && matchesQuery && (!state.onlineOnly || server.online) && (!state.favoritesOnly || state.favorites.has(server.id));
  }).sort((a, b) => {
    if (state.sort === "name") return a.name.localeCompare(b.name);
    if (state.sort === "capacity") return (b.players / b.max) - (a.players / a.max);
    if (state.sort === "free") return (b.max - b.players) - (a.max - a.players);
    return b.players - a.players;
  });
}

function render() {
  const results = filteredServers();
  const visible = results.slice(0, state.limit);
  emptyState.hidden = results.length > 0;
  list.innerHTML = visible.map((server, index) => {
    const percent = Math.min(100, Math.round(server.players / server.max * 100));
    const mapName = safeText(server.map);
    const website = server.website ? `<a href="${server.website}" target="_blank" rel="noopener noreferrer">Сайт ↗</a>` : "";
    const profile = `<button class="profile-link" type="button" data-profile="${server.id}">Профиль ↗</button>`;
    const command = `connect ${server.address}`;
    return `<tr>
      <td data-label="Сервер"><div class="server-info"><span class="rank-number">${String(index + 1).padStart(2, "0")}</span><div class="server-badge ${server.style}" aria-hidden="true">${safeText(server.badge)}</div><div class="server-name"><strong>${safeText(server.name)}</strong><div class="server-tags"><span class="server-tag ${server.type}">${typeLabels[server.type]}</span><span class="server-tag region-tag">${safeText(server.region)}</span></div><div class="server-links">${website}${profile}</div></div></div></td>
      <td class="players-cell" data-label="Игроки"><div class="players-number"><i class="${server.online ? "" : "offline"}" aria-hidden="true"></i>${server.players} <span style="color:#748074;font-weight:500">/ ${server.max}</span></div><div class="capacity" role="progressbar" aria-label="Заполненность сервера ${safeText(server.name)}" aria-valuemin="0" aria-valuemax="${server.max}" aria-valuenow="${server.players}"><span style="width:${percent}%"></span></div></td>
      <td class="map-cell" data-label="Карта">${mapName}</td>
      <td class="wipe-cell" data-label="Wipe">${server.wipe || "—"}<span>${server.wipeNote || "нет данных"}</span></td>
      <td class="address-cell" data-label="Адрес и команда"><code>${safeText(server.address)}</code><button class="copy-button" data-copy="${server.id}" aria-label="Скопировать команду ${safeText(command)}" title="Скопировать команду">⧉ <span>connect</span></button></td>
      <td class="server-actions"><button class="favorite-button ${state.favorites.has(server.id) ? "selected" : ""}" data-favorite="${server.id}" aria-label="${state.favorites.has(server.id) ? "Убрать из избранного" : "Добавить в избранное"}" aria-pressed="${state.favorites.has(server.id)}">${state.favorites.has(server.id) ? "★" : "☆"}</button><a class="join-button" href="steam://connect/${safeText(server.address)}" aria-label="Подключиться к ${safeText(server.name)} через Steam">ИГРАТЬ <span aria-hidden="true">↗</span></a></td>
    </tr>`;
  }).join("");
  const noun = results.length === 1 ? "сервер" : results.length < 5 ? "сервера" : "серверов";
  document.querySelector("#results-label").textContent = `Показано ${visible.length} из ${results.length} ${noun}`;
  document.querySelectorAll(".tab").forEach(tab => {
    if (tab.dataset.category === "all") tab.querySelector("span").textContent = servers.length;
  });
  document.querySelector("#load-more").hidden = visible.length >= results.length;
  document.querySelector("#favorite-count").textContent = state.favorites.size;
  document.querySelectorAll(".tab").forEach(tab => { if (tab.dataset.category === "all") tab.querySelector("span").textContent = servers.length; });
}

const countryRegions = { ru: "RU", ua: "RU", by: "RU", kz: "RU", am: "RU", ge: "RU", de: "EU", gb: "EU", fr: "EU", nl: "EU", pl: "EU", fi: "EU", se: "EU", no: "EU", dk: "EU", es: "EU", it: "EU", cz: "EU", at: "EU", au: "AU", us: "US", ca: "US" };
const serverFeedUrl = new URL("data/servers.json", document.baseURI);

function setLiveStatus(text, live = false) {
  const label = document.querySelector(".demo-label");
  label.innerHTML = `<i></i>${safeText(text)}`;
  label.classList.toggle("is-live", live);
  document.querySelector(".updated-note").innerHTML = `<i aria-hidden="true"></i> Источник <a href="https://battlemetrics.ru" target="_blank" rel="noopener noreferrer">BattleMetrics.ru</a>`;
}

function normalizeServer(item) {
  const [ip, port] = (item.address || "").split(":");
  const name = item.name || "Rust сервер";
  const country = (item.country || "").toUpperCase();
  const kind = /community|creative|sandbox|pve/i.test(name) ? "community" : /x\d|modded|modded|\bsolo\b|\bduo\b/i.test(name) ? "modded" : "vanilla";
  return { id: Number(item.id), name, type: kind, region: countryRegions[country.toLowerCase()] || (country === "" ? "EU" : country), players: Number(item.players) || 0, max: Number(item.max_players) || 1, map: item.map || "—", address: item.address || `${ip}:${port}`, profileUrl: item.url || `https://battlemetrics.ru/game/rust/server/${item.id}`, website: "", badge: name.split(/\s+/).slice(0, 2).map(word => word[0]).join("").slice(0, 2).toUpperCase(), style: Number(item.id) % 2 ? "orange" : "blue", online: Boolean(item.online), wipe: item.last_wipe ? new Date(item.last_wipe).toLocaleDateString("ru-RU") : "—", wipeNote: "последний вайп" };
}

async function refreshServers({ silent = false } = {}) {
  const button = document.querySelector("#refresh-button");
  button.disabled = true;
  setLiveStatus("ОБНОВЛЯЕМ…");
  try {
    const feedUrl = new URL(serverFeedUrl);
    feedUrl.searchParams.set("t", String(Date.now()));
    const response = await fetch(feedUrl, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`Файл каталога пока не опубликован (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data.servers)) throw new Error("Источник вернул неожиданный формат данных");
    if (!data.servers.length) {
      setLiveStatus("ДЕМО · ИСТОЧНИК ГОТОВИТСЯ");
      if (!silent) showToast("Пока показывается пример. Дождись настройки обновления каталога.");
      return;
    }
    servers = data.servers.map(normalizeServer);
    state.limit = Math.max(state.limit, 20);
    render();
    const onlineTotal = servers.reduce((sum, server) => sum + (server.online ? server.players : 0), 0);
    const peak = [...servers].sort((a, b) => b.players - a.players)[0];
    document.querySelector(".quick-stat:first-child div b").textContent = "Игроков онлайн";
    document.querySelector(".quick-stat:first-child div span").textContent = `${onlineTotal.toLocaleString("ru-RU")} игроков`;
    document.querySelector(".quick-stat:last-child div b").textContent = "Самый заполненный";
    document.querySelector(".quick-stat:last-child div span").textContent = peak ? `${peak.name.slice(0, 22)} · ${peak.players} / ${peak.max}` : "Нет данных";
    document.querySelector(".peak-badge").textContent = peak ? `${Math.round(peak.players / peak.max * 100)}%` : "—";
    const updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    const time = updatedAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setLiveStatus(`LIVE · ${time}`, true);
    document.querySelector(".section-kicker").textContent = `${Number(data.total || servers.length).toLocaleString("ru-RU")} СЕРВЕРОВ · ЖИВОЙ КАТАЛОГ`;
    document.querySelector(".rating-caption").textContent = `Обновлено в ${time}`;
    document.querySelector(".source-note").textContent = "Каталог автоматически обновляется примерно каждые 5 минут. Статистика предоставлена BattleMetrics.ru.";
  } catch (error) {
    setLiveStatus("ДЕМО · ЖДЁМ ПЕРВОЕ ОБНОВЛЕНИЕ");
    if (!silent) showToast(error.message || "Не удалось загрузить каталог");
  } finally {
    button.disabled = false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

function openServerProfile(server) {
  if (!server) return;
  const dialog = document.querySelector("#server-profile");
  const percent = Math.min(100, Math.round(server.players / server.max * 100));
  const website = server.website ? `<a href="${safeText(server.website)}" target="_blank" rel="noopener noreferrer">Официальный сайт ↗</a>` : "";
  const profile = server.profileUrl ? `<a href="${safeText(server.profileUrl)}" target="_blank" rel="noopener noreferrer">Страница сервера ↗</a>` : "";
  const command = `connect ${server.address}`;
  document.querySelector("#profile-content").innerHTML = `
    <div class="profile-kicker">RUST SERVER PROFILE · ${safeText(server.region)}</div>
    <div class="profile-heading"><span class="server-badge ${safeText(server.style)}" aria-hidden="true">${safeText(server.badge)}</span><div><h2 id="profile-title">${safeText(server.name)}</h2><span class="profile-status"><i class="${server.online ? "" : "offline"}"></i>${server.online ? "Сервер онлайн" : "Сервер недоступен"}</span></div></div>
    <div class="profile-player-count">${server.players.toLocaleString("ru-RU")} <span>/ ${server.max.toLocaleString("ru-RU")} игроков</span></div>
    <div class="profile-capacity" role="progressbar" aria-label="Заполненность сервера" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
    <dl class="profile-facts"><div><dt>Карта</dt><dd>${safeText(server.map)}</dd></div><div><dt>Регион</dt><dd>${safeText(server.region)}</dd></div><div><dt>Режим</dt><dd>${typeLabels[server.type] || "SERVER"}</dd></div><div><dt>Последний вайп</dt><dd>${safeText(server.wipe || "Нет данных")}</dd></div><div class="profile-address"><dt>Адрес</dt><dd><code>${safeText(server.address)}</code><button type="button" class="profile-copy" data-copy="${server.id}">Копировать connect</button></dd></div></dl>
    <div class="profile-actions"><a class="join-button" href="steam://connect/${safeText(server.address)}">Подключиться через Steam ↗</a>${website}${profile}</div>`;
  dialog.showModal();
}

async function copyConnectCommand(server) {
  const command = `connect ${server.address}`;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(command);
    } else {
      const field = document.createElement("textarea");
      field.value = command;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }
    showToast(`Скопировано: ${command}`);
  } catch {
    showToast(`Команда: ${command}`);
  }
}

document.querySelectorAll(".tab").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".tab.active")?.classList.remove("active");
  button.classList.add("active");
  document.querySelectorAll(".tab").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  state.category = button.dataset.category;
  state.limit = 20;
  render();
}));
document.querySelectorAll(".region").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".region.active")?.classList.remove("active");
  button.classList.add("active");
  document.querySelectorAll(".region").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  state.region = button.dataset.region;
  state.limit = 20;
  render();
}));
document.querySelector("#search").addEventListener("input", event => { state.query = event.target.value.trim(); state.limit = 20; render(); });
document.querySelector("#sort").addEventListener("change", event => { state.sort = event.target.value; render(); });
document.querySelector("#online-only").addEventListener("change", event => { state.onlineOnly = event.target.checked; render(); });
document.querySelector("#load-more").addEventListener("click", () => { state.limit += 20; render(); });
document.querySelector("#reset-filters").addEventListener("click", () => {
  state.category = "all"; state.region = "all"; state.query = ""; state.onlineOnly = false; state.favoritesOnly = false; state.limit = 20;
  document.querySelector("#search").value = "";
  document.querySelector("#online-only").checked = false;
  document.querySelectorAll(".tab").forEach(el => {
    const active = el.dataset.category === "all";
    el.classList.toggle("active", active);
    el.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".region").forEach(el => {
    const active = el.dataset.region === "all";
    el.classList.toggle("active", active);
    el.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".top-nav a, .top-nav button").forEach(el => {
    el.classList.remove("active");
    el.removeAttribute("aria-current");
  });
  document.querySelector("[data-nav-all]")?.classList.add("active");
  document.querySelector("[data-nav-filter='favorites']")?.setAttribute("aria-pressed", "false");
  document.querySelector("[data-nav-all]")?.setAttribute("aria-current", "page");
  render();
});
document.querySelector("#server-list").addEventListener("click", event => {
  const profile = event.target.closest("[data-profile]");
  if (profile) openServerProfile(servers.find(item => item.id === Number(profile.dataset.profile)));
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    const id = Number(favorite.dataset.favorite);
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    localStorage.setItem("rustwatch-favorites", JSON.stringify([...state.favorites]));
    render();
  }
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    const server = servers.find(item => item.id === Number(copy.dataset.copy));
    if (server) void copyConnectCommand(server);
  }
});
document.querySelector("#profile-close").addEventListener("click", () => document.querySelector("#server-profile").close());
document.querySelector("#server-profile").addEventListener("click", event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
  const copy = event.target.closest("[data-copy]");
  if (copy) {
    const server = servers.find(item => item.id === Number(copy.dataset.copy));
    if (server) void copyConnectCommand(server);
  }
});
document.querySelector("[data-nav-all]").addEventListener("click", event => {
  state.favoritesOnly = false;
  document.querySelector('[data-nav-filter="favorites"]').setAttribute("aria-pressed", "false");
  document.querySelectorAll(".top-nav a, .top-nav button").forEach(el => {
    el.classList.remove("active");
    el.removeAttribute("aria-current");
  });
  event.currentTarget.classList.add("active");
  event.currentTarget.setAttribute("aria-current", "page");
  state.limit = 20;
  render();
});
document.querySelector('[data-nav-filter="favorites"]').addEventListener("click", event => {
  event.preventDefault();
  state.favoritesOnly = !state.favoritesOnly;
  document.querySelectorAll(".top-nav a, .top-nav button").forEach(el => {
    el.classList.remove("active");
    el.removeAttribute("aria-current");
  });
  event.currentTarget.classList.toggle("active", state.favoritesOnly);
  event.currentTarget.setAttribute("aria-pressed", String(state.favoritesOnly));
  if (state.favoritesOnly) event.currentTarget.setAttribute("aria-current", "page");
  else event.currentTarget.removeAttribute("aria-current");
  if (!state.favoritesOnly) {
    const allServersLink = document.querySelector("[data-nav-all]");
    allServersLink.classList.add("active");
    allServersLink.setAttribute("aria-current", "page");
  }
  state.limit = 20;
  render();
  document.querySelector("#servers").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#refresh-button").addEventListener("click", () => void refreshServers());
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.querySelector("#search").focus(); }
  if (event.key === "Escape") document.querySelector("#search").blur();
});
render();
void refreshServers({ silent: true });
window.setInterval(() => void refreshServers(), 60_000);
