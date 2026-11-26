// MENU 페이지: 카테고리 필터 및 공통 모바일 메뉴/맨 위로
const header=document.querySelector('.site-header'),toggle=document.querySelector('.site-header__toggle');
if(header&&toggle){const setMenu=open=>{toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');header.classList.toggle('is-open',open)};toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)})}
const filterButtons=[...document.querySelectorAll('[data-filter]')];
const productGrid=document.querySelector('.menu-product-grid:not(.menu-more-items)');
const moreItems=document.querySelector('#menu-more-items');
const moreButton=document.querySelector('#menu-more-button');

// 나뉘어 있던 두 카드 목록을 하나의 Grid로 합쳐 필터링 시 빈칸이 생기지 않게 함
if(productGrid&&moreItems){
  [...moreItems.querySelectorAll('.menu-product')].forEach(product=>{
    product.dataset.moreItem='true';
    productGrid.appendChild(product);
  });
  moreItems.remove();
}
if(productGrid)productGrid.id='menu-product-grid';
if(moreButton)moreButton.setAttribute('aria-controls','menu-product-grid');

const products=[...document.querySelectorAll('.menu-product')];
let moreExpanded=false;
const updateMoreButton=()=>{
  if(!moreButton)return;
  moreButton.setAttribute('aria-expanded',String(moreExpanded));
  moreButton.innerHTML=moreExpanded?'메뉴 접기 <span aria-hidden="true">－</span>':'메뉴 더보기 <span aria-hidden="true">＋</span>';
};
const applyFilter=filter=>{
  const filtering=filter!=='all';
  products.forEach(product=>{
    const matches=filter==='all'||product.dataset.category===filter;
    product.hidden=!matches||(!filtering&&product.dataset.moreItem==='true'&&!moreExpanded);
  });
  if(moreButton)moreButton.hidden=filtering;
};
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  filterButtons.forEach(b=>{
    const active=b===button;
    b.classList.toggle('is-active',active);
    b.setAttribute('aria-pressed',String(active));
  });
  if(filter==='all')moreExpanded=false;
  applyFilter(filter);
  updateMoreButton();
}));
applyFilter('all');
updateMoreButton();
if(moreButton){
  moreButton.addEventListener('click',()=>{
    moreExpanded=!moreExpanded;
    applyFilter('all');
    updateMoreButton();
    if(moreExpanded&&productGrid)productGrid.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
const topButton=document.querySelector('.to-top');if(topButton){const update=()=>topButton.classList.toggle('is-show',window.scrollY>600);window.addEventListener('scroll',update,{passive:true});update();topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}))}

// 메뉴 페이지 HERO 슬라이더: 메인 페이지와 같은 Swiper 컨트롤
const menuHeroSlider=document.querySelector('.menu-hero__swiper');
if(menuHeroSlider&&typeof Swiper!=='undefined'){
  new Swiper(menuHeroSlider,{
    direction:'horizontal',
    loop:true,
    speed:700,
    autoplay:window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? false
      : {delay:5000,disableOnInteraction:false,pauseOnMouseEnter:true},
    navigation:{
      nextEl:'.menu-hero-next',
      prevEl:'.menu-hero-prev'
    },
    pagination:{
      el:'.menu-hero__pagination',
      type:'fraction',
      formatFractionCurrent:number=>number,
      formatFractionTotal:number=>number,
      renderFraction:(currentClass,totalClass)=>
        '<span class="'+currentClass+'"></span>'+
        '<span class="fraction-divider"> | </span>'+
        '<span class="'+totalClass+'"></span>'
    },
    scrollbar:{
      el:'.menu-hero__scrollbar',
      draggable:true,
      hide:false
    }
  });
}
