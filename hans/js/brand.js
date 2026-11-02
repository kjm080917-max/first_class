// HANS STORY 서브페이지 인터랙션: 모바일 메뉴, 섹션 등장, 목차 현재 위치, 맨 위로
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.site-header__toggle');
if (header && toggle) {
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    header.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}
const revealItems = document.querySelectorAll('.brand-section-heading, .brand-story__content, .brand-value-card, .brand-history__note, .brand-timeline li, .brand-bottom-cta');
revealItems.forEach(item => item.classList.add('brand-reveal'));
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));
const contents = [...document.querySelectorAll('.brand-subnav a')];
const sections = contents.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) contents.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
  }), { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach(section => navObserver.observe(section));
}
const topButton = document.querySelector('.to-top');
if (topButton) {
  const updateTop = () => topButton.classList.toggle('is-show', window.scrollY > 600);
  window.addEventListener('scroll', updateTop, { passive: true }); updateTop();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
