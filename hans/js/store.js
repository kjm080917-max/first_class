// STORE 페이지: 매장 목록 + Kakao 지도
// Kakao Developers에서 발급한 JavaScript 키만 입력하세요.
const KAKAO_JS_KEY = '여기에_JavaScript키';

// 임시 목록입니다. 실제 매장명·주소·전화번호 확인 후 교체해 주세요.
// 주소에 '임시'가 포함되어 있어 지도 마커는 생성되지 않습니다.
const stores = [
  {
    region: "서울",
    name: "강남점 (임시)",
    address: "서울 강남구 임시 주소",
    phone: "정보 확인 중"
  },
  {
    region: "서울",
    name: "서초점 (임시)",
    address: "서울 서초구 임시 주소",
    phone: "정보 확인 중"
  },
  {
    region: "서울",
    name: "송파점 (임시)",
    address: "서울 송파구 임시 주소",
    phone: "정보 확인 중"
  },
  {
    region: "경기",
    name: "분당점 (임시)",
    address: "경기 성남시 분당구 임시 주소",
    phone: "정보 확인 중"
  },
  {
    region: "인천",
    name: "인천점 (임시)",
    address: "인천 남동구 임시 주소",
    phone: "정보 확인 중"
  }
];

const searchInput = document.querySelector("#store-keyword");
const searchButton = document.querySelector("#store-search-button");
const sortSelect = document.querySelector("#store-sort");
const regionSelect = document.querySelector("#store-region");
const storeCount = document.querySelector("#store-count");
const storeList = document.querySelector("#store-list");
const pagination = document.querySelector("#store-pagination");
const mapSelection = document.querySelector("#store-map-selection");
const mapElement = document.querySelector("#map");
const mapFallback = document.querySelector("#map-fallback");
const itemsPerPage = 10;
let currentPage = 1;
let selectedStore = null;
let kakaoMap = null;
let geocoder = null;
let infoWindow = null;
let mapReady = false;
let mapFailed = false;
const addressCache = new Map();
const markerByStore = new Map();

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

const setMapFallback = (message, detail = "") => {
  if (!mapFallback) return;
  mapFallback.hidden = false;
  mapFallback.innerHTML = "";
  const strong = document.createElement("strong");
  strong.textContent = message;
  const paragraph = document.createElement("p");
  paragraph.textContent = detail || "JavaScript 키와 등록 도메인, SDK 연결 상태를 확인해 주세요.";
  mapFallback.append(strong, paragraph);
};

const isTemporaryAddress = address =>
  /예시|임시|OO구|OO로|00/.test(address);

const getCoordinates = address => {
  if (addressCache.has(address)) return addressCache.get(address);
  const request = new Promise(resolve => {
    if (isTemporaryAddress(address)) {
      resolve(null);
      return;
    }
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        resolve({
          lat: Number(result[0].y),
          lng: Number(result[0].x)
        });
      } else {
        resolve(null);
      }
    });
  });
  addressCache.set(address, request);
  return request;
};

const makeInfoContent = store => {
  const wrap = document.createElement("div");
  wrap.className = "store-map-info";
  const name = document.createElement("strong");
  name.textContent = store.name;
  const address = document.createElement("p");
  address.textContent = store.address;
  const phone = document.createElement("p");
  phone.textContent = "전화번호: " + store.phone;
  const link = document.createElement("a");
  const marker = markerByStore.get(store);
  const position = marker?.getPosition();
  if (position) {
    link.href = "https://map.kakao.com/link/to/" +
      encodeURIComponent(store.name) + "," + position.getLat() + "," + position.getLng();
  } else {
    link.href = "#";
  }
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "길찾기";
  wrap.append(name, address, phone, link);
  return wrap;
};

const openStoreInfo = store => {
  const marker = markerByStore.get(store);
  if (!mapReady || !marker || !infoWindow) return;
  infoWindow.close();
  infoWindow.setContent(makeInfoContent(store));
  infoWindow.open(kakaoMap, marker);
  kakaoMap.panTo(marker.getPosition());
  showSelectedStore(store, false);
};

const showSelectedStore = (store, moveMap = true) => {
  selectedStore = store;
  if (mapSelection) {
    mapSelection.replaceChildren();
    const label = document.createElement("span");
    label.textContent = "선택한 매장";
    const name = document.createElement("strong");
    name.textContent = store.name;
    const address = document.createElement("p");
    address.textContent = store.address;
    const phone = document.createElement("p");
    phone.textContent = "전화번호: " + store.phone;
    mapSelection.append(label, name, address, phone);
  }
  if (moveMap) openStoreInfo(store);
  syncSelectedCard();
};

const syncSelectedCard = () => {
  if (!storeList) return;
  storeList.querySelectorAll(".store-card").forEach(card => {
    const isSelected = Number(card.dataset.storeIndex) === stores.indexOf(selectedStore);
    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
};

const updateVisibleMarkers = async () => {
  if (!mapReady || mapFailed) return;
  const filtered = getFilteredStores();
  if (!filtered.length) {
    markerByStore.forEach(marker => marker.setMap(null));
    return;
  }

  const located = [];
  for (const store of filtered) {
    const coordinates = await getCoordinates(store.address);
    const existingMarker = markerByStore.get(store);

    if (!coordinates) {
      if (existingMarker) existingMarker.setMap(null);
      console.warn("[Kakao 지도] 주소를 좌표로 변환하지 못했습니다:", store.name, store.address,
        isTemporaryAddress(store.address) ? "(임시 주소이므로 실제 주소로 교체해야 합니다.)" : "");
      continue;
    }

    store.lat = coordinates.lat;
    store.lng = coordinates.lng;
    let marker = existingMarker;
    if (!marker) {
      marker = new kakao.maps.Marker({
        map: null,
        position: new kakao.maps.LatLng(coordinates.lat, coordinates.lng),
        title: store.name
      });
      markerByStore.set(store, marker);
      kakao.maps.event.addListener(marker, "click", () => {
        const currentResults = getFilteredStores();
        const index = currentResults.indexOf(store);
        if (index < 0) return;
        currentPage = Math.floor(index / itemsPerPage) + 1;
        renderStores();
        storeList?.querySelector('[data-store-index="' + stores.indexOf(store) + '"]')?.scrollIntoView({
          behavior: "smooth", block: "nearest"
        });
        openStoreInfo(store);
      });
    }
    marker.setPosition(new kakao.maps.LatLng(coordinates.lat, coordinates.lng));
    marker.setMap(kakaoMap);
    located.push(marker);
  }

  markerByStore.forEach((marker, store) => {
    if (!filtered.includes(store)) marker.setMap(null);
  });

  if (located.length > 1) {
    const bounds = new kakao.maps.LatLngBounds();
    located.forEach(marker => bounds.extend(marker.getPosition()));
    kakaoMap.setBounds(bounds);
  } else if (located.length === 1) {
    kakaoMap.setCenter(located[0].getPosition());
    kakaoMap.setLevel(4);
  }
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
  for (let page = first; page <= last; page += 1) addButton(String(page), page, false, page === currentPage);
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
    empty.textContent = "등록된 매장 정보가 없습니다.";
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
  syncSelectedCard();
};

const applyFilters = () => {
  currentPage = 1;
  renderStores();
  updateVisibleMarkers();
};
searchButton?.addEventListener("click", () => {
  searchInput?.focus();
  applyFilters();
});
searchInput?.addEventListener("input", applyFilters);
sortSelect?.addEventListener("change", applyFilters);
regionSelect?.addEventListener("change", applyFilters);

const loadKakaoMap = () => {
  if (!mapElement) return;
  if (!KAKAO_JS_KEY || KAKAO_JS_KEY === "여기에_JavaScript키") {
    // 임시 표시용 OpenStreetMap: 카카오 키가 없을 때 서울 중심의 일반 지도를 보여줍니다.
    // 실제 매장 위치나 매장별 마커를 나타내는 지도는 아닙니다.
    mapFailed = true;
    console.warn("[지도 안내] 카카오 JavaScript 키가 없어 임시 OpenStreetMap을 표시합니다. 실제 매장 위치는 표시되지 않습니다.");
    const temporaryMap = document.createElement("iframe");
    temporaryMap.className = "store-map__temporary";
    temporaryMap.title = "임시 지도 - 서울 중심";
    temporaryMap.src = "https://www.openstreetmap.org/export/embed.html?bbox=126.90%2C37.50%2C127.08%2C37.62&layer=mapnik&marker=37.5665%2C126.9780";
    temporaryMap.loading = "lazy";
    temporaryMap.referrerPolicy = "no-referrer-when-downgrade";
    mapElement.append(temporaryMap);
    if (mapFallback) mapFallback.hidden = true;
    return;
  }

  const script = document.createElement("script");
  script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=" +
    encodeURIComponent(KAKAO_JS_KEY) + "&libraries=services&autoload=false";
  script.async = true;
  script.onload = () => {
    if (!window.kakao?.maps?.load) {
      mapFailed = true;
      console.error("[Kakao 지도] SDK는 로드됐지만 kakao.maps.load를 찾을 수 없습니다. 키와 도메인 설정을 확인하세요.");
      setMapFallback("지도를 불러올 수 없습니다");
      return;
    }
    window.kakao.maps.load(async () => {
      try {
        kakaoMap = new kakao.maps.Map(mapElement, {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 8
        });
        geocoder = new kakao.maps.services.Geocoder();
        infoWindow = new kakao.maps.InfoWindow({ removable: true });
        const zoomControl = new kakao.maps.ZoomControl();
        kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        kakaoMap.setZoomable(true);
        mapReady = true;
        if (mapFallback) mapFallback.hidden = true;
        await updateVisibleMarkers();
      } catch (error) {
        mapFailed = true;
        console.error("[Kakao 지도] 지도 초기화 중 오류가 발생했습니다. JavaScript 키, 도메인, SDK 설정을 확인하세요.", error);
        setMapFallback("지도를 불러올 수 없습니다");
      }
    });
  };
  script.onerror = error => {
    mapFailed = true;
    console.error("[Kakao 지도] SDK 스크립트를 불러오지 못했습니다. 네트워크, JavaScript 키, 등록 도메인을 확인하세요.", error);
    setMapFallback("지도를 불러올 수 없습니다");
  };
  document.head.append(script);
};

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
loadKakaoMap();
