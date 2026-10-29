const walletKey = "rustwatch-wallet-v1";
const cooldownMs = 30 * 60 * 1000;
const rewardCoins = 2;
const collectibleNames = { wasteland: "Пустошь", outpost: "Аванпост", night: "Ночная вылазка" };
const elements = {
  balance: document.querySelector("#coin-balance"),
  label: document.querySelector("#playtime-label"),
  progress: document.querySelector("#playtime-progress"),
  bar: document.querySelector(".playtime-bar"),
  hint: document.querySelector("#reward-hint"),
  claim: document.querySelector("#claim-coins"),
  collection: document.querySelector("#collection-note"),
  toast: document.querySelector("#toast")
};

function readWallet() {
  try {
    const saved = JSON.parse(localStorage.getItem(walletKey) || "{}");
    return {
      coins: Number.isSafeInteger(saved.coins) && saved.coins >= 0 ? saved.coins : 0,
      cards: Array.isArray(saved.cards) ? saved.cards.filter(id => id in collectibleNames) : [],
      lastClaimAt: Number.isFinite(saved.lastClaimAt) ? saved.lastClaimAt : 0
    };
  } catch {
    return { coins: 0, cards: [], lastClaimAt: 0 };
  }
}

let wallet = readWallet();

function saveWallet() {
  localStorage.setItem(walletKey, JSON.stringify(wallet));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

function renderWallet() {
  const remaining = Math.max(0, wallet.lastClaimAt + cooldownMs - Date.now());
  const ready = remaining === 0;
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const elapsed = Math.min(cooldownMs, Date.now() - wallet.lastClaimAt);
  const progress = wallet.lastClaimAt ? Math.floor(elapsed / cooldownMs * 100) : 100;

  elements.balance.textContent = wallet.coins.toLocaleString("ru-RU");
  elements.label.textContent = ready ? "Можно забрать" : `${minutes}:${String(seconds).padStart(2, "0")}`;
  elements.progress.style.width = `${progress}%`;
  elements.bar.setAttribute("aria-valuenow", String(Math.round(progress * 30 / 100)));
  elements.bar.setAttribute("aria-valuetext", ready ? "Награда доступна" : `До награды ${minutes} минут ${seconds} секунд`);
  elements.hint.textContent = ready ? "Нажми кнопку — получишь 2 монеты" : "Новая награда появится через 30 минут после получения предыдущей";
  elements.claim.disabled = !ready;
  elements.claim.innerHTML = ready ? "Забрать 2 монеты <span aria-hidden=\"true\">◈</span>" : `Подожди ${minutes}:${String(seconds).padStart(2, "0")}`;
  elements.collection.textContent = wallet.cards.length
    ? `В коллекции: ${wallet.cards.map(id => collectibleNames[id]).join(", ")}`
    : "Баланс и коллекция хранятся в этом браузере.";

  document.querySelectorAll("[data-buy-card]").forEach(button => {
    const owned = wallet.cards.includes(button.dataset.buyCard);
    const price = Number(button.dataset.price);
    button.disabled = owned || wallet.coins < price;
    button.innerHTML = owned ? "В коллекции <b>✓</b>" : `Купить <b>◈ ${price}</b>`;
  });
}

elements.claim.addEventListener("click", () => {
  if (Date.now() < wallet.lastClaimAt + cooldownMs) return;
  wallet.coins += rewardCoins;
  wallet.lastClaimAt = Date.now();
  saveWallet();
  renderWallet();
  showToast("Начислено 2 монеты");
});

document.querySelector("#card-shop").addEventListener("click", event => {
  const button = event.target.closest("[data-buy-card]");
  if (!button || button.disabled) return;
  const cardId = button.dataset.buyCard;
  const price = Number(button.dataset.price);
  if (!collectibleNames[cardId] || wallet.coins < price || wallet.cards.includes(cardId)) return;
  wallet.coins -= price;
  wallet.cards.push(cardId);
  saveWallet();
  renderWallet();
  showToast(`Карточка «${collectibleNames[cardId]}» добавлена в коллекцию`);
});

window.addEventListener("storage", event => {
  if (event.key === walletKey) {
    wallet = readWallet();
    renderWallet();
  }
});

renderWallet();
window.setInterval(renderWallet, 1000);
