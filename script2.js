function toNum(str) {
  return Number(str.replace(/ /g, "")) || 0;
}

function toCurrency(num) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
}

// Класс корзины
class Cart {
  constructor() {
    this.products = [];
  }

  get count() {
    return this.products.length;
  }

  addProduct(product) {
    this.products.push(product);
  }

  removeProduct(index) {
    if (index >= 0 && index < this.products.length) {
      this.products.splice(index, 1);
    }
  }

  get cost() {
    return this.products.reduce((sum, product) => sum + toNum(product.price), 0);
  }
}

// Класс продукта
class Product {
  constructor(card) {
    this.imageSrc = card.querySelector("#prod-img")?.src || "";
    this.name = card.querySelector(".product-name")?.textContent || "";
    this.price = card.querySelector(".product-price")?.textContent || "0";
  }
}

// Инициализация корзины
const myCart = new Cart();
const cartNum = document.getElementById("cart_num");
const cart = document.getElementById("cart");

// Загрузка корзины из localStorage
function loadCart() {
  try {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const parsed = JSON.parse(cartData);
      if (parsed && Array.isArray(parsed.products)) {
        myCart.products = parsed.products;
      }
    }
  } catch (e) {
    console.error("Ошибка загрузки корзины:", e);
    myCart.products = [];
  }
  updateCartCounter();
}

// Сохранение корзины в localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(myCart));
  updateCartCounter();
}

// Обновление счетчика корзины
function updateCartCounter() {
  cartNum.textContent = myCart.count.toString();
}

// Инициализация обработчиков добавления в корзину
function initAddToCartButtons() {
  document.querySelectorAll(".card__add").forEach(button => {
    if (!button.classList.contains('daily-add')) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const card = e.target.closest(".product");
        if (card) {
          const product = new Product(card);
          myCart.addProduct(product);
          saveCart();
          
          // Анимация добавления
          card.classList.add("added-to-cart");
          setTimeout(() => card.classList.remove("added-to-cart"), 1000);
        }
      });
    }
  });
}

// Работа с попапом корзины
const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");

function openCartPopup() {
  popup.classList.add("popup--open");
  document.body.classList.add("lock");
  renderCartPopup();
}

function closeCartPopup() {
  popup.classList.remove("popup--open");
  document.body.classList.remove("lock");
}

function renderCartPopup() {
  popupProductList.innerHTML = "";
  
  myCart.products.forEach((product, index) => {
    const productItem = document.createElement("div");
    productItem.className = "popup__product";
    
    productItem.innerHTML = `
      <div class="popup__product-wrap">
        <img src="${product.imageSrc}" class="popup__product-image" alt="${product.name}">
        <h2 class="popup__product-title">${product.name}</h2>
      </div>
      <div class="popup__product-wrap">
        <div class="popup__product-price">${product.price}</div>
        <button class="popup__product-delete">✖</button>
      </div>
    `;
    
    productItem.querySelector(".popup__product-delete").addEventListener("click", () => {
      myCart.removeProduct(index);
      saveCart();
      renderCartPopup();
    });
    
    popupProductList.appendChild(productItem);
  });
  
  popupCost.value = toCurrency(myCart.cost);
}

// Блюда дня
const dailySpecials = [
  // Воскресенье
  {
    name: "Тост с авокадо и рыбой",
    desc: "Состав: цельнозерновой хлеб, авокадо, слабосоленый лосось, лимонный сок, укроп.",
    price: "420",
    weight: "250 г.",
    image: "day7.jfif"
  },
  // Понедельник
  {
    name: "Вок с рисом и курицей",
    desc: "Состав: жареный рис, куриное филе, болгарский перец, морковь, лук, соус терияки, кунжут.",
    price: "390",
    weight: "400 г.",
    image: "day1.jpg"
  },
  // Вторник
  {
    name: "Пельмени Гёдза",
    desc: "Состав: тонкое тесто, фарш из свинины и капусты, чеснок, имбирь, соевый соус.",
    price: "320",
    weight: "12 шт 450 г.",
    image: "day2.jpg"
  },
  // Среда
  {
    name: "Капкейк с джемом",
    desc: "Состав: бисквитная основа, ванильный крем, абрикосовый джем, свежие ягоды.",
    price: "250",
    weight: "150 г.",
    image: "day3.jpg"
  },
  // Четверг
  {
    name: "Якитори",
    desc: "Состав: куриные бедра, лук, соус якитори (соевый соус, мирин, саке, сахар), кунжут.",
    price: "380",
    weight: "6 шт 300 г.",
    image: "day4.jfif"
  },
  // Пятница
  {
    name: "Чай матча",
    desc: "Состав: японский зеленый чай матча высшего сорта, горячая вода 80°C.",
    price: "200",
    weight: "250 мл.",
    image: "day5.jfif"
  },
  // Суббота
  {
    name: "Брокколи с соусом мисо",
    desc: "Состав: свежая брокколи, соус мисо (паста мисо, мирин, саке, сахар), кунжутное масло.",
    price: "280",
    weight: "250 г.",
    image: "day6.jfif"
  }
];

function setDailySpecial() {
  const today = new Date().getDay();
  const special = dailySpecials[today];
  const dailyProduct = document.getElementById("daily-special");
  
  if (special && dailyProduct) {
    document.getElementById("daily-name").textContent = special.name;
    document.getElementById("daily-desc").textContent = special.desc;
    document.getElementById("daily-price").textContent = special.price;
    document.getElementById("daily-weight").textContent = special.weight;
    dailyProduct.querySelector("#prod-img").src = special.image;
  }
}

// Инициализация блюда дня
document.querySelector(".daily-add")?.addEventListener("click", (e) => {
  e.preventDefault();
  const card = e.target.closest(".product");
  if (card) {
    const product = new Product(card);
    myCart.addProduct(product);
    saveCart();
    
    // Анимация добавления
    card.classList.add("added-to-cart");
    setTimeout(() => card.classList.remove("added-to-cart"), 1000);
  }
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setDailySpecial();
  initAddToCartButtons();
  
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    openCartPopup();
  });
  
  popupClose.addEventListener("click", (e) => {
    e.preventDefault();
    closeCartPopup();
  });
});