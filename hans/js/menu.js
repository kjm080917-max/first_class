// MENU 페이지: 카테고리 필터 및 공통 모바일 메뉴/맨 위로
const header=document.querySelector('.site-header'),toggle=document.querySelector('.site-header__toggle');
if(header&&toggle){const setMenu=open=>{toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');header.classList.toggle('is-open',open)};toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)})}
const filterButtons=[...document.querySelectorAll('[data-filter]')],products=[...document.querySelectorAll('.menu-product')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;filterButtons.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});products.forEach(product=>product.hidden=filter!=='all'&&product.dataset.category!==filter)}));
const moreButton=document.querySelector('#menu-more-button'),moreItems=document.querySelector('#menu-more-items');
if(moreButton&&moreItems){moreButton.addEventListener('click',()=>{const expanded=moreButton.getAttribute('aria-expanded')==='true';moreButton.setAttribute('aria-expanded',String(!expanded));moreItems.hidden=expanded;moreButton.innerHTML=expanded?'메뉴 더보기 <span aria-hidden="true">＋</span>':'메뉴 접기 <span aria-hidden="true">－</span>';if(!expanded)moreItems.scrollIntoView({behavior:'smooth',block:'start'})})}
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
