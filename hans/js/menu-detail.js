const menuDetails={
 "xmas-fraisier":{type:"CHRISTMAS CAKE",title:"X-mas 스트로베리 프레지에",description:"크리스마스 시즌을 더욱 특별하게 만들어 줄 스트로베리 프레지에 케이크.",image:"img/sp_cake02.png"},
 "xmas-ganache":{type:"CHRISTMAS CAKE",title:"X-mas 사각가나슈 S",description:"연말의 달콤한 순간을 함께하는 크리스마스 사각가나슈 케이크.",image:"img/sp_cake03.png"},
 "xmas-strawberry":{type:"CHRISTMAS CAKE",title:"X-mas 한스 딸기생크림 S",description:"한스의 딸기 생크림 케이크로 완성하는 따뜻한 크리스마스 테이블.",image:"img/sp_cake04.png"},
 "almond-delight":{type:"COOKIES",title:"아몬드 딜라이트",description:"고소한 아몬드가 어우러진 바삭한 쿠키.",image:"img/img01.png"},
 "almond-chocolate":{type:"CHOCOLATE",title:"아몬드 쇼콜라",description:"진한 초콜릿의 풍미를 담은 아몬드 초콜릿.",image:"img/img02.png"},
 "carrot-cake":{type:"CAKE",title:"당근케이크",description:"당근의 은은한 풍미와 부드러운 식감을 즐길 수 있는 케이크.",image:"img/img03.png"},
 "valrhona-mini":{type:"CAKE",title:"발로나초코 mini",description:"진한 발로나 초콜릿의 풍미를 담은 미니 케이크.",image:"img/img04.png"},
 strawberry:{type:"CAKE",title:"딸기 생크림 케이크",description:"부드러운 시트와 산뜻한 딸기가 어우러진 케이크.",image:"img/img05.png"},
 "almond-delight":{type:"COOKIES",title:"아몬드 딜라이트",description:"고소한 풍미를 살린 아몬드 딜라이트 쿠키.",image:"img/cookies.png"},
 "cake-menu":{type:"CAKE",title:"케이크 메뉴",description:"한스의 다양한 케이크 메뉴를 소개합니다. 실제 제품 정보로 내용을 업데이트해 주세요."},
 "season-cake":{type:"CAKE",title:"시즌 케이크",description:"계절과 특별한 날에 어울리는 시즌 케이크 메뉴입니다."},
 "dessert-menu":{type:"DESSERT",title:"디저트 메뉴",description:"한스에서 만날 수 있는 다양한 디저트 메뉴입니다."}
};
const key=new URLSearchParams(location.search).get("item");
const item=menuDetails[key]||menuDetails.strawberry;
document.getElementById("detail-type").textContent=item.type;
document.getElementById("detail-title").textContent=item.title;
document.getElementById("detail-description").textContent=item.description;
const detailVisual=document.getElementById("detail-image");
if(item.image&&detailVisual){detailVisual.innerHTML=`<img src="${item.image}" alt="${item.title}">`;detailVisual.setAttribute("aria-label",item.title);detailVisual.classList.add("has-product-image");}
document.title=item.title+" | HANS CAKE";
const menuOrder=["xmas-fraisier","xmas-ganache","xmas-strawberry","almond-delight","almond-chocolate","carrot-cake","valrhona-mini","strawberry","cake-menu","season-cake","dessert-menu"];
const moveMenu=(direction)=>{const current=menuOrder.indexOf(key);const next=(current+direction+menuOrder.length)%menuOrder.length;location.href="menu-detail.html?item="+menuOrder[next]};
document.querySelector(".menu-detail__arrow--prev")?.addEventListener("click",()=>moveMenu(-1));
document.querySelector(".menu-detail__arrow--next")?.addEventListener("click",()=>moveMenu(1));
