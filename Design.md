# HANS 웹사이트 Design System

> 이 문서는 `hans/index.html`, `hans/css/main.css`, `hans/js/main.js`, 공통 `css/default.css`를 기준으로 현재 메인 페이지의 구현을 분석한 서브페이지 제작 가이드입니다.  
> **메인 페이지의 디자인을 수정하거나 재정의하기 위한 문서가 아닙니다.** 서브페이지 제작 시 기존 시각 언어와 UI 규칙을 이어가기 위해 사용합니다.

---

## 1. Project Overview

### 프로젝트 범위
- 브랜드: **HANS / 한스케이크**
- 분석 대상: `hans/index.html` 메인 페이지와 연결된 `hans/css/main.css`, `hans/js/main.js`
- 공통 초기화: `css/default.css`
- 구현 환경: HTML, CSS, JavaScript 및 메인 페이지에서 사용 중인 Swiper
- 메인 페이지는 Hero 슬라이드, 매장찾기·가맹문의, 메뉴, 브랜드 스토리, 스페셜 케이크, 뉴스·이벤트, Footer로 구성되어 있습니다.

### 사이트 목적과 디자인 방향
메인 화면은 케이크와 브랜드 이야기를 시각적으로 전달하고, 메뉴·매장·가맹·브랜드·이벤트 정보를 탐색하도록 구성되어 있습니다.  
디자인은 **따뜻한 베이지·크림 배경과 브랜드 오렌지 포인트, 큰 타이포그래피, 제품 이미지 중심의 여백 있는 레이아웃**을 사용합니다.

- 확인된 구성: Hero의 브랜드 메시지와 이미지 슬라이드, 메뉴 카드, 브랜드 문구, 스페셜 케이크 이미지, SNS 콘텐츠 영역
- 디자인 해석: 제품의 이미지와 감성적인 문구가 먼저 보이도록 하고, 메뉴·매장·브랜드 정보로 자연스럽게 이어지는 브랜드 소개형 랜딩 페이지입니다.

---

## 2. Brand Identity

### 시각적 정체성
| 요소 | 구현에서 확인한 특징 | 서브페이지 적용 기준 |
|---|---|---|
| 브랜드 포인트 | 오렌지 `#FF552E` | 주요 제목 강조, 핵심 CTA, 현재 메뉴, 포인트 그래픽에 사용 |
| 기본 분위기 | 화이트·베이지·피치·크림 계열 | 큰 면적의 배경은 밝고 따뜻한 중성색으로 유지 |
| 이미지 | 케이크·디저트 이미지가 주요 시각 콘텐츠 | 이미지가 주인공이 되도록 주변 장식과 텍스트를 절제 |
| 타이포그래피 | Pretendard Variable, 굵은 제목, 큰 영문/한글 문구 | 제목은 명확하고 강하게, 본문은 읽기 쉽게 |
| 레이아웃 | 넓은 콘텐츠 폭, 섹션별 여백, 이미지와 텍스트의 균형 | 한 화면에 정보를 과도하게 밀집시키지 않음 |
| 모션 | 짧고 부드러운 이동·확대·페이드 | 사용자의 탐색을 방해하지 않는 보조 효과로 사용 |

### 브랜드 표현
- **따뜻함:** 크림·베이지·피치 배경과 케이크 이미지
- **프리미엄/정돈:** 여백, 간결한 텍스트, 균형 잡힌 정렬
- **생동감:** 오렌지 포인트 컬러와 이미지/카드의 가벼운 인터랙션
- **브랜드 메시지:** 큰 글자와 짧은 문장으로 감성적인 문구를 강조

위 항목 중 ‘프리미엄’ 등은 CSS와 화면 구성에서 읽어낸 디자인 해석이며, 별도의 브랜드 가이드 문구로 확인된 사실은 아닙니다.

---

## 3. Design Principles

1. **제품 이미지 우선**  
   케이크 이미지는 주요 콘텐츠입니다. 이미지의 비율과 형태를 유지하고, 장식이 이미지보다 먼저 눈에 띄지 않게 합니다.

2. **오렌지는 강조에 사용**  
   `--color-brand-orange` / `--text-brand`를 핵심 액션과 강조 텍스트에 사용합니다. 모든 요소를 오렌지색으로 처리하지 않습니다.

3. **밝고 따뜻한 바탕 유지**  
   일반 콘텐츠 영역은 화이트·베이지·크림·라이트그레이를 중심으로 구성합니다. 어두운 배경은 Footer처럼 현재 디자인에서 지정된 영역에 제한적으로 사용합니다.

4. **제목과 본문의 위계를 분명히**  
   섹션 제목은 크고 굵게, 카드 제목은 중간 크기, 설명은 작은 크기로 구분합니다. 제목과 본문을 같은 강도로 만들지 않습니다.

5. **여백으로 섹션을 구분**  
   콘텐츠를 선이나 박스로 모두 나누기보다 섹션 패딩과 간격을 활용합니다. 단, 현재 메인 CSS에서 시안에 맞춘 개별 여백은 임의로 통일하지 않습니다.

6. **반응형은 콘텐츠 재배치 중심**  
   화면이 좁아지면 2열 배너를 1열로, 4열 뉴스 그리드를 2열로 바꾸고 메뉴 카드 수를 조절합니다.

7. **인터랙션은 짧고 절제되게**  
   hover 시 약간의 이동·확대·색 변화로 피드백을 주고, 키보드 Focus와 모션 감소 설정도 고려합니다.

---

## 4. Color System

아래 값은 `hans/css/main.css`의 `:root`에 정의된 실제 CSS 변수입니다. 서브페이지에서는 가능하면 변수명을 그대로 사용합니다.

### CSS 변수
| 변수 | 값 | 용도/현재 사용 |
|---|---|---|
| `--text-primary` | `#222222` | 기본 제목·본문 텍스트 |
| `--text-brand` | `#FF552E` | 브랜드 강조 텍스트 |
| `--text-default` | `#F5F5F5` | 밝은 배경 위/배경용 텍스트 계열 |
| `--text-secondary` | `#4B4746` | 보조 설명 텍스트 |
| `--color-white` | `#FFFFFF` | 기본 흰 배경, 흰색 UI |
| `--color-bage` | `#F6F3F0` | 베이지 계열 배경 |
| `--color-brand-orange` | `#FF552E` | 브랜드 컬러, CTA·강조 |
| `--color-peach` | `#FFF0E5` | 피치 배경, 배너 조합 |
| `--color-warm-gray` | `#4B4746` | 따뜻한 회색 텍스트 |
| `--color-black` | `#222222` | 어두운 배경·대비 요소 |
| `--color-light-gray` | `#F5F5F5` | 밝은 회색 배경 |
| `--color-cream` | `#E9DCD3` | 크림 배경, 스페셜 영역 |

### 사용 규칙
- **주요 CTA/브랜드 강조:** `var(--color-brand-orange)`
- **일반 본문:** `var(--text-primary)`
- **설명/보조 텍스트:** `var(--text-secondary)`
- **기본 배경:** `var(--color-white)`
- **부드러운 섹션 배경:** `var(--color-bage)`, `var(--color-peach)`, `var(--color-cream)`
- **어두운 Footer:** `var(--color-black)`

메인 CSS에 변수로 정의되지 않은 반투명 흰색/검정색 값은 Header 그림자, Hero 오버레이 등 특정 효과에 직접 사용됩니다. 서브페이지에서 필요할 때만 유사한 용도로 제한하고 새로운 브랜드 컬러처럼 사용하지 않습니다.

---

## 5. Typography

### 기본 글꼴
- 메인 페이지: **Pretendard Variable**
- HTML에서 `../font/css/pretendardvariable.css`를 불러오고, `body`에 `font-family: "Pretendard Variable", sans-serif`를 적용합니다.
- 영문 브랜드 문구도 기본적으로 같은 폰트를 사용하며, 별도 장식 폰트를 무분별하게 추가하지 않습니다.

### 실제 크기/굵기 규칙
| 대상 | CSS 값 | 적용 방식 |
|---|---|---|
| 섹션 제목 토큰 | `--fs-title: clamp(36px, 4vw, 64px)` | 매장찾기·Hans Menu·News 제목 등에 사용 |
| 섹션 제목 굵기 | `--fw-title: 800` | 주요 섹션 제목 |
| 작은 글자 토큰 | `--fs-caption: 14px` | Footer 링크 등 작은 공통 텍스트 |
| Hero 제목 | `clamp(42px, 6.25vw, 120px)`, 모바일 `clamp(38px, 9vw, 64px)` | 큰 브랜드 문구 |
| Hero 설명 | `clamp(16px, 1.25vw, 24px)`, 모바일 `clamp(15px, 3.8vw, 20px)` | Hero 보조 문장 |
| Header GNB | 데스크톱 `18px / 500`, 모바일 `15px` | 메뉴 링크 |
| Header 보조 링크 | 데스크톱 `16px` | 매장찾기·가맹문의 |
| 메뉴 카드 제목 | `24px / 700 / line-height 1.5` | 제품명 |
| 메뉴 카드 설명 | `14px / 500 / line-height 1.5` | 제품 설명 |
| Store/Franchise 제목 | `var(--fs-title) / var(--fw-title) / 1.2` | 배너 제목 |
| Store/Franchise 설명 | 데스크톱 `clamp(18px, 1.67vw, 32px)`, 모바일 `clamp(18px, 4.2vw, 24px)` | 배너 설명 |

### 적용 원칙
- 큰 제목은 `font-weight: 800` 또는 해당 컴포넌트에서 지정한 굵기를 사용합니다.
- 본문은 주로 `14px~18px`, `font-weight: 400~500`, `line-height: 1.5`로 읽기 쉽게 구성합니다.
- 메뉴 제목은 `letter-spacing: -0.02em` 또는 후속 디테일 규칙의 `-0.03em`을 적용합니다.
- 주요 섹션 제목에는 `letter-spacing: -0.03em`이 공통으로 적용됩니다.
- 한국어 문장이 어색하게 분리되지 않도록 `word-break: keep-all`을 유지합니다.
- 크기는 고정값만 사용하기보다 메인 페이지의 `clamp()` 패턴을 우선합니다.

---

## 6. Layout & Spacing

### 컨테이너 및 정렬
| 영역 | 기준 |
|---|---|
| Header 내부 | `width: min(calc(100% - 40px), 1720px)`, 가운데 정렬 |
| Header 로고 | 데스크톱 `109 × 64px`, 모바일 `78 × 48px` |
| GNB | `width: 600px`, 5열 Grid |
| Mega menu | `width: 600px`, 5열 Grid |
| Hans Menu 내부 | `width: min(100%, 1782px)` |
| Hans Brand 내부 | `width: min(100%, 1240px)` |
| News Grid | `width: min(100%, 1528px)`, 4열 |
| Footer 내부 | `max-width: 1636px` |

### 간격 토큰
- `--section-x-mo: 24px`: 모바일 섹션 좌우 여백
- `--gap-grid: 16px`: News Grid의 기본 간격
- `--fs-title`, `--fw-title`: 제목 공통 토큰
- 모바일 전환 기준은 현재 메인 CSS에서 **1024px**, 세부 좁은 화면 조정은 **600px / 480px**입니다.

### Grid / Flex 사용
- **Grid:** Header GNB 5열, Mega menu 5열, Store/Franchise 2열, News 4열/모바일 2열
- **Flex:** Header 정렬, 메뉴 카드 내부, Footer 내부, 버튼·아이콘 정렬
- **Swiper:** Hero 슬라이드와 메뉴 카드 슬라이드
- **이미지:** Hero는 `object-fit: cover`, 메뉴 제품은 `object-fit: contain`으로 목적에 맞게 표시

### 섹션별 여백
- Hero: Header 높이만큼 상단 여백(`90px`, 모바일 `60px`)
- Store/Franchise: 데스크톱 `80px max(5vw, 32px) 50px`, 모바일 `48px 24px 28px`
- Hans Menu: 데스크톱 `150px max(3.6vw, 24px) 112px`, 모바일 `76px 24px 64px`
- Hans News: 데스크톱 `150px 24px`, 모바일 `80px var(--section-x-mo)`
- Footer: 데스크톱 `128px`, 모바일 `64px 24px`

> **주의:** 메인 CSS에는 시안에 맞춘 고유한 음수 margin, 이미지 margin, 섹션별 높이가 있습니다. 예: Hans Special 제목의 `margin-bottom: -214px`, 메뉴 이미지의 개별 margin, Brand 이미지의 음수 margin. 이 값은 공통 spacing token으로 단순 통일하지 말고 해당 컴포넌트의 시각적 겹침 의도로 이해합니다.

---

## 7. Components

### Header / GNB
- 클래스: `.site-header`, `.site-header__bar`, `.site-header__inner`, `.site-header__logo`, `.site-nav`, `.site-header__links`
- 데스크톱: 상단 고정 Header(`position: fixed`, `height: 90px`), 중앙 5개 GNB, 오른쪽 매장찾기·가맹문의
- 모바일(1024px 이하): Header `60px`, 로고 왼쪽, 햄버거 버튼 오른쪽, GNB는 열고 닫는 목록
- 메뉴 활성 상태: `.is-current`에 브랜드 오렌지 색과 굵기 변화, 데스크톱에서는 밑줄 애니메이션
- Mega menu: 데스크톱에서 Header hover 또는 focus-within 시 표시, 모바일에서는 숨김

### Hero
- 클래스: `.hero-sec`, `.hero-copy`, `.hero-controls`, `.hero-prev`, `.hero-next`
- 배경 이미지 슬라이드와 이미지 위 텍스트 오버레이
- 진행 바, 현재/전체 슬라이드 수, 이전/다음 버튼
- Hero 문구는 HTML 슬라이드의 `data-title`, `data-desc`와 JS에서 동기화

### Store / Franchise 배너
- 클래스: `.store-franchise`, `.store-franchise__item`, `.store-franchise__content`, `.store-franchise__arrow`
- 데스크톱 2열, 모바일 1열
- 매장찾기: 오렌지 배경/베이지 계열 텍스트
- 가맹문의: 피치 배경/브랜드 오렌지 텍스트
- 우측 하단 원형 화살표가 CTA 역할

### Menu Card
- 클래스: `.hans-menu__card`, `.hans-menu__image`, `.hans-menu__text`
- 제품 이미지, 제품명, 설명으로 구성
- 이미지 영역 크기를 확보하고 `object-fit: contain`으로 제품 형태를 유지
- Swiper로 데스크톱 3개, 중간 화면 2개, 좁은 화면 약 1.15개씩 표시해 다음 카드가 있음을 보여줌
- 카드 자체는 과한 테두리/그림자보다 이미지와 텍스트 중심

### Hans Brand / Special
- Brand: `.hans-brand__inner`, `.hans-brand__line`, `.hans-brand__image`
  - 큰 문장과 이미지가 줄 사이에 배치되어 겹치는 레이아웃
  - 강조 단어는 `em`에 `var(--text-brand)`
- Special: `.hans-special`, `.hans-special__image`, `.hans-special__more`
  - 크림/베이지 배경 분할, 큰 영문 제목, 중앙 제품 이미지, pill 형태의 View More CTA

### News / Event Card
- 클래스: `.hans-news__grid`, `.hans-news__card`, `.hans-news__instagram`
- 4열 Grid, 모바일 2열
- 카드 비율 `aspect-ratio: 1`로 정사각형 유지
- 이미지 `object-fit: cover`
- hover/focus 시 어두운 오버레이와 VIEW 텍스트

### Footer
- 클래스: `.site-footer`, `.site-footer__inner`, `.site-footer__company`, `.site-footer__info`, `.site-footer__nav`
- 어두운 `--color-black` 배경, 회색 계열 정보 텍스트
- 브랜드 로고/정보와 세로형 링크 메뉴
- 모바일에서는 회사 정보와 링크 영역을 세로로 배치하고 링크는 2열 Grid

### 공통 UI 작성 원칙
- 새 서브페이지의 버튼/카드/링크는 위 컴포넌트의 색·폰트·간격·모션 규칙을 재사용합니다.
- 새 컴포넌트는 기존 클래스 네이밍과 충돌하지 않도록 페이지/컴포넌트 접두어를 붙입니다.
- 반복되는 색과 제목 크기는 CSS 변수로 관리하고, 개별 페이지에서 임의의 다른 브랜드 컬러를 추가하지 않습니다.

---

## 8. Interaction

### Hover / Active
| 대상 | 상태 변화 |
|---|---|
| GNB | 오렌지 텍스트, 굵기 증가, 데스크톱 밑줄 애니메이션 |
| Header 보조 링크 | 오렌지 색, opacity 증가 |
| Mega menu 링크 | 오렌지 색/굵기 강조 |
| Store/Franchise 배너 | 밝기 미세 조정, 텍스트 8px 이동, 화살표 5px 이동 |
| Menu 카드 | 위로 6px 이동, 이미지 1.04배 확대, 제목 브랜드 컬러 |
| Menu 페이지네이션 | hover 시 오렌지 반투명 배경, active는 오렌지 채움 |
| Special CTA | 오렌지 배경, hover 시 위로 이동·그림자, 화살표 이동 |
| News 카드 | 이미지 1.04배 확대, VIEW 오버레이 표시 |
| Footer 링크 | 흰색에 가까운 색, 오른쪽 3px 이동 |
| To Top 버튼 | 스크롤 600px 이후 표시, 클릭 시 부드럽게 맨 위 이동 |

### Focus / Keyboard
- 공통 Reset은 `:focus` outline을 제거하지만 `:focus-visible`은 유지합니다.
- 주요 Header 링크/메뉴/버튼, Store 배너, Menu CTA, Footer 링크에 `:focus-visible` 외곽선이 정의되어 있습니다.
- 모바일 메뉴는 버튼의 `aria-expanded` 상태를 갱신하고, Escape 키로 닫을 수 있습니다.
- 새 서브페이지에서도 키보드로 이동할 수 있는 요소에는 명확한 Focus 표시를 유지합니다.

### Transition / Motion
- 기본 전환 시간: 주로 `0.2s~0.45s`, 이미지/스크롤 등장은 `0.65s~0.7s` 범위
- easing: `ease`, `ease-out`, 또는 `cubic-bezier(.2, .7, .3, 1)`
- 스크롤 등장: IntersectionObserver를 이용해 `.is-visible`, `.motion-visible` 클래스 적용
- Hero 자동 재생: 5초 간격, 마우스 진입 시 일시 정지
- `prefers-reduced-motion: reduce` 설정에서는 애니메이션/transition을 줄이거나 제거

---

## 9. Responsive Rules

### Breakpoint
| 기준 | 현재 메인 페이지 적용 |
|---|---|
| `1024px 이하` | 모바일/태블릿 레이아웃으로 전환: Header 60px, GNB 접힘, Hero 모바일 이미지, 배너 1열, News 2열, 메뉴 카드 2개 |
| `600px 이상` | Menu Swiper 2개씩 표시 |
| `600px 미만` | Menu Swiper 약 1.15개 표시, Brand 문구/이미지 축소 |
| `480px 이하` | Special 제목/CTA 크기 추가 조정 |

### 반응형 제작 원칙
- 고정 너비보다 `width: min()`, `max-width`, `clamp()`, Grid/Flex를 우선 사용합니다.
- 이미지에는 콘텐츠 목적에 따라 `object-fit: cover` 또는 `contain`을 지정합니다.
- 모바일 좌우 여백은 `var(--section-x-mo)`(24px)를 우선 활용합니다.
- 데스크톱에서 가로로 나열된 콘텐츠는 모바일에서 세로로 쌓거나 열 수를 줄입니다.
- 메뉴/버튼은 터치하기 편한 크기를 유지합니다. Header 토글은 40px, 모바일 화살표 버튼은 36~48px 기준이 현재 구현에 있습니다.
- 화면 너비가 360px보다 작아도 가로 스크롤이 발생하지 않도록 새 서브페이지에서 확인합니다. (메인 CSS는 360px을 최소 너비로 고정하지 않음)

---

## 10. Do & Don't

### DO
- [ ] `hans/css/main.css`의 컬러 변수를 먼저 사용합니다.
- [ ] Pretendard Variable과 제목/본문의 크기 위계를 유지합니다.
- [ ] 밝은 크림·베이지·화이트 바탕에 오렌지 포인트를 적용합니다.
- [ ] 제품 이미지를 중심으로 충분한 여백을 확보합니다.
- [ ] Header/Footer와 반복 컴포넌트의 구조·클래스 네이밍을 참고합니다.
- [ ] Grid/Flex와 현재 breakpoint(1024px, 600px, 480px)를 기준으로 반응형을 설계합니다.
- [ ] hover뿐 아니라 focus-visible, active, 키보드 조작 상태를 고려합니다.
- [ ] `prefers-reduced-motion`을 지원하고 모션을 과하게 사용하지 않습니다.
- [ ] 링크는 새 서브페이지 내부 경로, 페이지 내 앵커 또는 프로젝트에서 준비한 로컬 페이지로 연결합니다.

### DON'T
- [ ] 메인 페이지 `hans/index.html` 및 `hans/css/main.css`의 디자인을 서브페이지 작업 때문에 수정하지 않습니다.
- [ ] CSS 변수에 없는 컬러/간격/폰트 수치를 근거 없이 브랜드 표준처럼 추가하지 않습니다.
- [ ] 메인 페이지와 무관한 과한 그림자, 두꺼운 테두리, 과도한 그라데이션/애니메이션을 기본 스타일로 만들지 않습니다.
- [ ] 모든 섹션을 동일한 padding이나 높이로 강제 통일하지 않습니다. 시안 기반 예외값은 유지합니다.
- [ ] 제품 이미지를 `cover`로 잘라 제품이 손상되게 하지 않습니다. 제품 이미지에는 기본적으로 `contain`을 사용합니다.
- [ ] 외부의 **기존 한스 브랜드 공식 사이트**로 링크를 연결하지 않습니다. 공식 사이트 주소를 임의로 추정하거나 새로 만들지 않습니다.
- [ ] 현재 메인 페이지의 Instagram 링크를 서브페이지의 외부 링크 규칙으로 확대 적용하지 않습니다. 서브페이지 링크는 로컬 페이지/앵커/프로젝트 내부 경로로 우선 구성합니다.
- [ ] Focus 표시를 제거하거나 키보드 조작이 불가능한 UI를 만들지 않습니다.

---

## Reference Files

- `hans/index.html` — 메인 페이지 HTML 구조 및 콘텐츠
- `hans/css/main.css` — HANS 메인 디자인 토큰, 레이아웃, 컴포넌트, 반응형, 인터랙션
- `hans/js/main.js` — Hero/Menu Swiper, 스크롤 등장, 모바일 GNB, 현재 메뉴 표시, Header 숨김/복귀, To Top
- `css/default.css` — 공통 Reset, 기본 접근성/폼/미디어 규칙
- `font/css/pretendardvariable.css` — Pretendard Variable 폰트
