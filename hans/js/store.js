// STORE 페이지: 예시 매장 데이터와 목록 UI
// 아래 매장명·주소·전화번호는 화면 구현을 위한 가상 데이터이며 실제 매장 정보가 아닙니다.
// 실제 매장 정보로 교체할 때 공식 자료를 확인하고 lat/lng에 실제 좌표를 입력하세요.
const stores = [
  { region:"서울", name:"한스 강남 예시점", address:"서울 강남구 (예시 주소)", phone:"02-000-0001", image:"", lat:null, lng:null },
  { region:"서울", name:"한스 잠실 예시점", address:"서울 송파구 (예시 주소)", phone:"02-000-0002", image:"", lat:null, lng:null },
  { region:"서울", name:"한스 홍대 예시점", address:"서울 마포구 (예시 주소)", phone:"02-000-0003", image:"", lat:null, lng:null },
  { region:"경기", name:"한스 분당 예시점", address:"경기 성남시 분당구 (예시 주소)", phone:"031-000-0001", image:"", lat:null, lng:null },
  { region:"경기", name:"한스 수원 예시점", address:"경기 수원시 (예시 주소)", phone:"031-000-0002", image:"", lat:null, lng:null },
  { region:"경기", name:"한스 일산 예시점", address:"경기 고양시 일산동구 (예시 주소)", phone:"031-000-0003", image:"", lat:null, lng:null },
  { region:"인천", name:"한스 송도 예시점", address:"인천 연수구 (예시 주소)", phone:"032-000-0001", image:"", lat:null, lng:null },
  { region:"인천", name:"한스 부평 예시점", address:"인천 부평구 (예시 주소)", phone:"032-000-0002", image:"", lat:null, lng:null },
  { region:"부산", name:"한스 해운대 예시점", address:"부산 해운대구 (예시 주소)", phone:"051-000-0001", image:"", lat:null, lng:null },
  { region:"대전", name:"한스 둔산 예시점", address:"대전 서구 (예시 주소)", phone:"042-000-0001", image:"", lat:null, lng:null }
];

const searchInput = document.querySelector("#store-keyword");
const searchButton = document.querySelector("#store-search-button");
const sortSelect = document.querySelector("#store-sort");
const regionSelect = document.querySelector("#store-region");
const storeCount = document.querySelector("#store-count");
const storeList = document.querySelector("#store-list");
const pagination = document.querySelector("#store-pagination");
const mapSelection = document.querySelector("#store-map-selection");
const itemsPerPage = 10;
let currentPage = 1;
let selectedStore = null;

const getFilteredStores = () => {
  const keyword = (searchInput?.value || "").trim().toLocaleLowerCase("ko");
  const region = regionSelect?.value || "all";
  const result = stores.filter(store => {
    const matchesRegion = region === "all" || store.region === region;
    const searchable = [store.region, store.name, store.address, store.phone].join(" ").toLocaleLowerCase("ko");
    return matchesRegion && searchable.includes(keyword);
  });
  if (sortSelect?.value === "region") {
    result.sort((a, b) => a.region.localeCompare(b.region, "ko") || a.name.localeCompare(b.name, "ko"));
  }
  return result;
};

const showSelectedStore = store => {
  selectedStore = store;
  if (!mapSelection) return;
  mapSelection.replaceChildren();
  const label = document.createElement("span");
  label.textContent = "선택한 매장";
  const name = document.createElement("strong");
  name.textContent = store.name;
  const address = document.createElement("p");
  address.textContent = store.address;
  const phone = document.createElement("p");
  phone.textContent = "전화번호: " + store.phone;
  const note = document.createElement("p");
  note.textContent = "지도 API 연결 후 이 매장의 좌표로 이동하고 마커를 강조 표시합니다.";
  mapSelection.append(label, name, address, phone, note);
  storeList?.querySelectorAll(".store-card").forEach(card => {
    card.classList.toggle("is-selected", Number(card.dataset.storeIndex) === stores.indexOf(store));
    card.setAttribute("aria-pressed", String(Number(card.dataset.storeIndex) === stores.indexOf(store)));
  });
};

const renderPagination = totalPages => {
  if (!pagination) return;
  pagination.replaceChildren();
  if (totalPages <= 1) return;
  const addButton = (label, page, disabled = false, current = false) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.disabled = disabled;
    if (current) button.setAttribute("aria-current", "page");
    button.addEventListener("click", () => {
      currentPage = page;
      renderStores();
    });
    pagination.append(button);
  };
  addButton("‹", Math.max(1, currentPage - 1), currentPage === 1);
  const first = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const last = Math.min(totalPages, first + 4);
  for (let page = first; page <= last; page += 1) {
    addButton(String(page), page, false, page === currentPage);
  }
  addButton("›", Math.min(totalPages, currentPage + 1), currentPage === totalPages);
};

const renderStores = () => {
  if (!storeList || !storeCount) return;
  const filtered = getFilteredStores();
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  currentPage = Math.min(currentPage, totalPages);
  const visible = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  storeCount.textContent = "검색 결과 " + filtered.length + "개";
  storeList.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "store-list__empty";
    empty.textContent = "검색 결과가 없습니다. 지역이나 매장명을 다시 확인해 주세요.";
    storeList.append(empty);
  } else {
    visible.forEach(store => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "store-card";
      card.dataset.storeIndex = String(stores.indexOf(store));
      card.setAttribute("aria-pressed", String(selectedStore === store));
      if (selectedStore === store) card.classList.add("is-selected");

      const imageWrap = document.createElement("span");
      imageWrap.className = "store-card__image";
      const image = document.createElement("img");
      image.src = store.image || "/first_class/hans/img/logo.png";
      image.alt = store.image ? store.name + " 매장 사진" : "한스케이크 로고";
      image.onerror = () => { image.onerror = null; image.src = "/first_class/hans/img/logo.png"; };
      imageWrap.append(image);

      const info = document.createElement("span");
      info.className = "store-card__info";
      const region = document.createElement("span");
      region.className = "store-card__region";
      region.textContent = store.region;
      const name = document.createElement("strong");
      name.className = "store-card__name";
      name.textContent = store.name;
      const address = document.createElement("span");
      address.className = "store-card__address";
      address.textContent = store.address;
      info.append(region, name, address);
      card.append(imageWrap, info);
      card.addEventListener("click", () => showSelectedStore(store));
      storeList.append(card);
    });
  }
  renderPagination(totalPages);
};

const applyFilters = () => {
  currentPage = 1;
  renderStores();
};
searchButton?.addEventListener("click", () => {
  searchInput?.focus();
  applyFilters();
});
searchInput?.addEventListener("input", applyFilters);
sortSelect?.addEventListener("change", applyFilters);
regionSelect?.addEventListener("change", applyFilters);

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".site-header__toggle");
if (header && toggle) {
  const setMenu = open => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    header.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  document.querySelectorAll(".site-nav a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => { if (event.key === "Escape") setMenu(false); });
}

const topButton = document.querySelector(".to-top");
if (topButton) {
  const updateTopButton = () => topButton.classList.toggle("is-show", window.scrollY > 600);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

renderStores();
