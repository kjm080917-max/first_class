// 슬라이드별 히어로 문구 (문구는 index.html의 data-title / data-desc에서 수정)
const heroCopy = document.querySelector('.hero-copy');
const heroSlides = document.querySelectorAll('.hero-sec .swiper-slide:not(.swiper-slide-duplicate)');
let heroTimer;

function updateHeroCopy(index) {
    const slide = heroSlides[index];
    if (!slide || !heroCopy) return;
    heroCopy.classList.add('is-changing');
    clearTimeout(heroTimer);
    heroTimer = setTimeout(() => {
        // data-title / data-desc가 없는 슬라이드는 기존 문구 유지
        if (slide.dataset.title) heroCopy.querySelector('h1').textContent = slide.dataset.title;
        if (slide.dataset.desc) heroCopy.querySelector('p').textContent = slide.dataset.desc;
        heroCopy.classList.remove('is-changing');
    }, 350);
}

const swiper = new Swiper('.hero-sec > .swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? false
        : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    on: {
        slideChange(sw) { updateHeroCopy(sw.realIndex); },
    },

    navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
    },

    pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
        formatFractionCurrent: (number) => number,
        formatFractionTotal: (number) => number,
        renderFraction: (currentClass, totalClass) =>
            '<span class="' + currentClass + '"></span>' +
            '<span class="fraction-divider"> | </span>' +
            '<span class="' + totalClass + '"></span>',
    },

    scrollbar: {
        el: '.visual .swiper-scrollbar',
        draggable: true,
        hide: false,
    },
});

const menuRevealItems = document.querySelectorAll('.menu-reveal');
// 메뉴 카드가 많아도 넘길 때 오래 비어 보이지 않도록 딜레이를 3개 단위로 반복
menuRevealItems.forEach((item, i) => item.style.setProperty('--reveal-delay', `${(i % 3) * 120}ms`));

if ('IntersectionObserver' in window) {
    const menuRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    menuRevealItems.forEach((item) => menuRevealObserver.observe(item));
} else {
    menuRevealItems.forEach((item) => item.classList.add('is-visible'));
}

// 페이지 전반의 스크롤 등장 애니메이션
const motionTargets = document.querySelectorAll(
    '.store-franchise > *, .hans-menu > *, .hans-brand__inner > *, ' +
    '.hans-special h2, .hans-special__image, .hans-special__more, ' +
    '.hans-news > h2, .hans-news__card, .site-footer__inner > *'
);

motionTargets.forEach((item, index) => {
    item.classList.add('motion-reveal');
    if (item.matches('.hans-news__card')) {
        item.style.setProperty('--motion-delay', `${(index % 4) * 70}ms`);
    }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('motion-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
    });

    motionTargets.forEach((item) => motionObserver.observe(item));
} else {
    motionTargets.forEach((item) => item.classList.add('motion-visible'));
}

const navToggle = document.querySelector('.site-header__toggle');
const siteHeader = document.querySelector('.site-header');

const setNav = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    siteHeader.classList.toggle('is-open', open);
};

navToggle.addEventListener('click', () => {
    setNav(navToggle.getAttribute('aria-expanded') !== 'true');
});

// 모바일에서 메뉴 링크를 누르면 메뉴를 닫음
document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => setNav(false));
});

// 스크롤 위치에 따라 현재 메뉴 강조 + 헤더 숨김/표시 + 맨 위로 버튼
const navLinks = document.querySelectorAll('.site-nav a');
const spySections = ['menu', 'store', 'brand', 'event', 'special']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
const toTop = document.querySelector('.to-top');
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
    const y = window.scrollY;
    const isOpen = siteHeader.classList.contains('is-open');

    // 현재 섹션 메뉴 강조 (화면 위쪽 1/3 지점 기준)
    const probe = y + window.innerHeight / 3;
    let currentId = '';
    spySections.forEach((sec) => {
        if (sec.offsetTop <= probe) currentId = sec.id;
    });
    navLinks.forEach((link) => {
        link.classList.toggle('is-current', link.getAttribute('href') === '#' + currentId);
    });

    // 아래로 스크롤하면 헤더 숨김, 위로 스크롤하면 표시
    if (!isOpen && y > 200 && y > lastY + 4) {
        siteHeader.classList.add('is-hidden');
    } else if (y < lastY - 4 || y <= 200) {
        siteHeader.classList.remove('is-hidden');
    }
    lastY = y;

    toTop.classList.toggle('is-show', y > 600);
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Esc 키로 모바일 메뉴 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNav(false);
});

// Hans Menu 슬라이더: 화살표와 페이지 표시를 화면 크기에 맞게 작동
const hansMenuSlider = document.querySelector('.hans-menu__swiper');
const hansMenuNext = document.querySelector('.hans-menu__next');
const hansMenuDots = document.querySelector('.hans-menu__dots');

if (hansMenuSlider) {
    const hansMenuSwiper = new Swiper(hansMenuSlider, {
        slidesPerView: 1.15,
        slidesPerGroup: 1,
        spaceBetween: 12,
        rewind: true,
        watchOverflow: false,
        navigation: {
            nextEl: hansMenuNext,
        },
        pagination: {
            el: hansMenuDots,
            clickable: true,
        },
        breakpoints: {
            600: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 16,
            },
            1025: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 10,
            },
        },
    });

}
