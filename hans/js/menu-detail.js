const menuDetails={
 strawberry:{type:"CAKE",title:"딸기 생크림 케이크",description:"부드러운 화이트 시트와 달콤한 커스터드 크림, 새콤한 산딸기 콩포트가 어우러진 케이크."},
 "almond-chocolate":{type:"DESSERT",title:"아몬드 쇼콜라",description:"품질 좋은 초콜릿으로 정성을 담아 만든 수제 초콜릿."},
 "almond-delight":{type:"DESSERT",title:"아몬드 딜라이트",description:"고소한 아몬드와 버터향이 가득한 고급스러운 쿠키."},
 "cake-menu":{type:"CAKE",title:"케이크 메뉴",description:"한스의 다양한 케이크 메뉴를 소개합니다. 실제 제품 정보로 내용을 업데이트해 주세요."},
 "season-cake":{type:"CAKE",title:"시즌 케이크",description:"계절과 특별한 날에 어울리는 시즌 케이크 메뉴입니다."},
 "dessert-menu":{type:"DESSERT",title:"디저트 메뉴",description:"한스에서 만날 수 있는 다양한 디저트 메뉴입니다."}
};
const key=new URLSearchParams(location.search).get("item");
const item=menuDetails[key]||menuDetails.strawberry;
document.getElementById("detail-type").textContent=item.type;
document.getElementById("detail-title").textContent=item.title;
document.getElementById("detail-description").textContent=item.description;
document.title=item.title+" | HANS CAKE";