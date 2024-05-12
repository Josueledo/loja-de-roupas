let roda = document.querySelector(".flor");
let sections = document.querySelectorAll("section");
// menu responsivo
let menuContainer = document.querySelector(".menu");
// Items
let itemContainer = document.querySelector(".items-container");
// carrinho items
let carrinho = document.querySelector(".carrinho");
let dark = document.querySelector(".darkCart");
let menuDark = document.querySelector(".menuDark");
let carrinhoContainer = document.querySelector(".carrinho-container");
let vazio = document.querySelector(".vazio");
let cartIcon = document.querySelector(".cartIcon-btn");
// favorite items
let favorite = document.querySelector(".favorite");
let favoriteItems = document.querySelector(".favoriteItems");
let vazioFavorite = document.querySelector(".favoriteVazio");
let favoriteDark = document.querySelector(".favoriteBgDark");
let favoriteCount = document.querySelector(".favoriteCount");
// SERACH
let searchContainer = document.querySelector(".searchItems");
let searchPai = document.querySelector(".search");


var lastScrollTop = 0;
window.addEventListener(
  "scroll",
  function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    let x = 0;

    if (st > lastScrollTop) {
      x += 10;
      roda.style.transform = `rotate(${st}deg)`;
    } else if (st < lastScrollTop) {
      // upscroll code
      roda.style.transform = `rotate(${st}deg)`;
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false
);
window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY + 300;
    let offset = sec.offsetTop;
    let height = sec.offsetHeight;

    if (top >= offset && top < offset + height) {
      sec.classList.add("show-animate");
    } else {
      sec.classList.remove("show-animate");
    }
  });
};

function addItems() {
  fetch("./db.json").then((response) => {
    response.json().then((data) => {
      console.log(data);

      console.log(Object.keys(data.products));
      for (let i = 0; Object.keys(data.products) > i; i++) {}

      let container = document.querySelector(".items-container");

      for (let i = 0; data.products.length > i; i++) {
        let item = `
        <div class="swiper-slide">
        <div class="images">
          <img src="${data.products[i].image1}" class="hover" alt="" >
          <img src="${data.products[i].image2}" alt="">
          <div class="cart">
          <i class="fa-solid fa-cart-shopping" onclick="addCarrinho()"></i>
        </div>
        </div>
        <div class="like" onclick="favoriteAction()">
          <i class="fa-regular fa-heart"></i>
        </div>
        <div class="stars">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </div>
        <div class="name">${data.products[i].name}</div>
        <div class="price">R$ ${data.products[i].price},00</div>
        <p class="desconto">${data.products[i].desconto}</p>
      </div>
      `;

        container.innerHTML += item;
      }
    });
  });
}

function menu() {
  menuContainer.classList.toggle("hidden");
  menuDark.classList.toggle("hidden");
}

// CARRINHO FUNÇÕES
function carrinhoShow() {
  carrinho.classList.toggle("hidden");
  dark.classList.toggle("hidden");
}
let cart = [];

function addCarrinho() {
  let el = event.target.parentNode.parentNode.parentNode;
  let image = el.children[0].children[0].src;
  let name = el.children[3].innerHTML;
  let price = el.children[4].innerHTML;
  let desconto = el.children[5].innerHTML;

  let item = `
 <div class="item">
  <div class="img-container">
    <img src="${image}">
  </div>
  <div class="nameCount">
    <h1>${name}</h1>
    <div class="count">
      <button onclick="priceAndCount()">-</button>
      <span class="totalCountItem">1</span>
      <button onclick="priceAndCount()">+</button>
    </div>
  </div>
    <div class="deletePrice">
      <i class="fa-regular fa-trash-can" onclick="deleteItem()"></i>
      <span class="price">${price}</span>
    </div>
</div>
  `;

  if (carrinhoContainer.childElementCount === 0) {
    carrinhoContainer.innerHTML += item;
    updateTotalCarrinho();
    checkCarrinho();
  } else {
    for (let i = 0; carrinhoContainer.childElementCount > i; i++) {
      if (
        carrinhoContainer.children[i].children[1].children[0].innerHTML === name
      ) {
        let count =
          carrinhoContainer.children[i].children[1].children[1].children[1]
            .innerHTML;
        let name2 =
          carrinhoContainer.children[i].children[1].children[0].innerHTML;
        let price =
          carrinhoContainer.children[i].children[2].children[1].innerHTML;
        count = parseInt(count);
        count++;
        carrinhoContainer.children[
          i
        ].children[1].children[1].children[1].innerHTML = count;
        fetch("./db.json")
          .then((response) => {
            response.json().then((data) => {
              for (let j = 0; data.products.length > j; j++) {
                if (data.products[j].name === name2) {
                  let realPrice = data.products[j].price;
                  newPrice = realPrice * count;
                  console.log(
                    carrinhoContainer.children[i].children[2].children[1]
                      .innerHTML
                  );
                  carrinhoContainer.children[
                    i
                  ].children[2].children[1].innerHTML =
                    "R$ " + newPrice + ",00";
                  updateTotalCarrinho();
                  checkCarrinho();
                }
              }
            });
          })
          .catch((err) => console.log(err));
        newPrice = price * count;

        return;
      } else {
      }
    }
    carrinhoContainer.innerHTML += item;
  }

  cart = [];
  for (let i = 0; carrinhoContainer.childElementCount > i; i++) {
    cart.push(carrinhoContainer.children[i]);
  }
  updateTotalCarrinho();
  checkCarrinho();
}
function priceAndCount() {
  el = event.target;
  pai = event.target.parentNode;
  let count = pai.children[1].innerHTML;
  count = parseInt(count);
  if (el.innerHTML === "+") {
    count++;
    pai.children[1].innerHTML = count;
    incrisePrice();
  } else if (el.innerHTML === "-") {
    count--;
    pai.children[1].innerHTML = count;
    dicrisePrice();
  }
  updateTotalCarrinho();
}
function incrisePrice(num) {
  el = event.target;
  pai = event.target.parentNode;
  let count = pai.children[1].innerHTML;
  count = parseInt(count);
  let price = pai.parentNode.parentNode.children[2].children[1].innerHTML;
  let name = pai.parentNode.parentNode.children[1].children[0].innerHTML;

  fetch("./db.json").then((response) => {
    response.json().then((data) => {
      for (let i = 0; data.products.length > i; i++) {
        if (data.products[i].name === name) {
          let realPrice = data.products[i].price;
          newPrice = realPrice * count;
          pai.parentNode.parentNode.children[2].children[1].innerHTML =
            "R$ " + newPrice + ",00";
          updateTotalCarrinho();
          countIcon();
        }
      }
    });
  });
  newPrice = price * count;
}
function dicrisePrice() {
  el = event.target;
  pai = event.target.parentNode;
  let count = pai.children[1].innerHTML;
  count = parseInt(count);
  let price = pai.parentNode.parentNode.children[2].children[1].innerHTML;
  let name = pai.parentNode.parentNode.children[1].children[0].innerHTML;
  let test = price.replace("R$", "");
  test = parseInt(test);

  fetch("./db.json").then((response) => {
    response.json().then((data) => {
      for (let i = 0; data.products.length > i; i++) {
        if (data.products[i].name === name) {
          let realPrice = data.products[i].price;
          console.log(realPrice);
          newPrice = test - realPrice;
          pai.parentNode.parentNode.children[2].children[1].innerHTML =
            "R$ " + newPrice + ",00";
          updateTotalCarrinho();
          countIcon();
        }
      }
    });
  });
  newPrice = price * count;
}
function countIcon() {
  let totalcart = 0;
  for (let i = 0; carrinhoContainer.childElementCount > i; i++) {
    totalcart += parseInt(
      carrinhoContainer.children[i].children[1].children[1].children[1]
        .innerHTML
    );
  }
  cartIcon.innerHTML = totalcart;
}

function checkCarrinho() {
  if (carrinhoContainer.childElementCount === 0) {
    vazio.classList.remove("hidden");
    cartIcon.classList.add("hidden");
  } else {
    vazio.classList.add("hidden");
    cartIcon.classList.remove("hidden");
    countIcon();
  }
}

function updateTotalCarrinho() {
  let totalDisplay =
    carrinho.children[2].children[0].children[0].children[1].children[0]
      .children[0];
  let descontoDisplay =
    carrinho.children[2].children[0].children[0].children[1].children[0]
      .children[1].children[1].innerHTML;
  descontoDisplay = descontoDisplay.replace("R$", "");
  let total = 0;
  if (carrinhoContainer.childElementCount === 0) {
    totalDisplay.innerHTML = "R$ 00,00";
    carrinho.children[2].children[0].children[0].children[1].children[0].children[1].children[1].innerHTML =
      "R$ 00,00";
  } else {
    for (let i = 0; carrinhoContainer.childElementCount > i; i++) {
      let price =
        carrinhoContainer.children[i].children[2].children[1].innerHTML;
      let tratamento;
      tratamento = price.replace("R$", "");
      tratamento = parseInt(tratamento);
      total += tratamento;
      totalDisplay.innerHTML = "R$ " + total + ",00";
      descontoDisplay = total / 4;
      carrinho.children[2].children[0].children[0].children[1].children[0].children[1].children[1].innerHTML =
        "R$ " +
        descontoDisplay.toLocaleString("pt-br", { minimumFractionDigits: 2 });
    }
  }
}
function deleteItem() {
  let el = event.currentTarget;
  let item = el.parentElement.parentElement;
  let index = cart.indexOf(item);
  cart.splice(index, 1);
  carrinhoContainer.innerHTML = "";
  for (let i = 0; cart.length > i; i++) {
    carrinhoContainer.appendChild(cart[i]);
  }
  updateTotalCarrinho();
  checkCarrinho();
}
checkCarrinho();

// FAVOIRITE FUNCTIONS
function showFavorite() {
  if (favorite.classList.contains("hidden")) {
    favorite.classList.remove("hidden");
    favoriteDark.classList.remove("hidden");
  } else {
    favorite.classList.add("hidden");
    favoriteDark.classList.add("hidden");
  }
}
function favoriteAction() {
  el = event.target;
  console.log(el);
  el.classList.toggle("fa-solid");
  el.classList.toggle("active");

  addFavorite(el);
}
function checkfavoriteIsClear() {
  console.log(favoriteItems.childElementCount);
  if (favoriteItems.childElementCount === 0) {
    vazioFavorite.classList.remove("hidden");
    favoriteCount.classList.add("hidden");
  } else {
    favoriteCount.classList.remove("hidden");
    vazioFavorite.classList.add("hidden");
  }
}
let fav = [];
function addFavorite(el) {
  itemRef = el.parentElement.parentElement;
  itemName = itemRef.children[3].innerHTML;
  itemImage = itemRef.children[0].children[1].src;
  itemActive = itemRef.children[1].children[0];
  console.log(itemRef);
  let item = `
    <div class="item">
      <div class="headerItem">
        <div class="imgConteiner">
          <img src="${itemImage}" alt="">
        </div>
        <h1>${itemName}</h1>
        <i class="fa fa-trash" aria-hidden="true" onclick="removeFavorite()"></i>
      </div>
    </div>
  `;
  if (itemActive.classList.contains("active")) {
    favoriteItems.innerHTML += item;
    fav = [];
    for (let i = 0; favoriteItems.childElementCount > i; i++) {
      fav.push(favoriteItems.children[i]);
    }
  } else {
    removeFavorite();
  }
  incrementCountFavorite();
  checkfavoriteIsClear();
}
function removeFavorite() {
  el = event.target;
  let item = el.parentElement.parentElement;

  itemRef = el.parentElement.parentElement;
  let index = fav.indexOf(item);
  fav.splice(index, 1);
  favoriteItems.innerHTML = "";
  for (let i = 0; fav.length > i; i++) {
    favoriteItems.appendChild(fav[i]);
  }
  incrementCountFavorite();
  checkfavoriteIsClear();
  // remover active de botao
  try {
    for (let i = 0; itemContainer.childElementCount > i; i++) {
      let icon = itemContainer.children[i].children[1].children[0];
      if (icon.classList.contains("active")) {
        let nameRemove = el.parentElement.children[1].innerHTML;
        if (nameRemove === itemContainer.children[i].children[3].innerHTML) {
          icon.classList.remove("active");
          icon.classList.remove("fa-solid");
          incrementCountFavorite();
          checkfavoriteIsClear();
        }
      }
    }
  } catch {
    return;
  }
}
function incrementCountFavorite() {
  favoriteCount.innerHTML = favoriteItems.childElementCount;
}
checkfavoriteIsClear();

// SEARCH FUNCTIONS

function showSearch() {
  searchPai.classList.toggle("hidden");
}
function search() {
  fetch("./db.json")
    .then((response) => {
      response.json().then((data) => {
        searchContainer.innerHTML = "";
        data.products.forEach((item) => {
          let v = item.name;
          if (v.toLowerCase().includes(input.value.toLowerCase())) {
            let produto = ``;
            produto = `
             <div class="swiper-slide">
            <div class="images">
             <img src="${item.image1}" class="hover" alt="" >
             <img src="${item.image2}" alt="">
             <div class="cart">
             <i class="fa-solid fa-cart-shopping" onclick="addCarrinho()"></i>
           </div>
           </div>
           <div class="like" onclick="favoriteAction()">
             <i class="fa-regular fa-heart"></i>
           </div>
           <div class="stars">
             <i class="fa-solid fa-star"></i>
             <i class="fa-solid fa-star"></i>
             <i class="fa-solid fa-star"></i>
             <i class="fa-solid fa-star"></i>
             <i class="fa-solid fa-star"></i>
           </div>
           <div class="name">${item.name}</div>
           <div class="price">R$ ${item.price},00</div>
           <p class="desconto">${item.desconto}</p>
         </div> 
       </div>       
            `;
            searchContainer.innerHTML += produto;
            
          }
        });
      });
    })
    .catch((err) => alert("Erro ao carregar produtos"));
    searchContainer.childElementCount === 0?console.log("Nenhum item encontrado"):console.log("algo")
}


addItems();
