document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. MENÚ HAMBURGUESA
  // =========================================
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");
  const overlay = document.getElementById("menu-overlay");

  const toggleMenu = () => {
    navLinks.classList.toggle("active");
    if (menuToggle) menuToggle.classList.toggle("is-active");
    if (overlay) overlay.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "initial";
  };

  if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", toggleMenu);

  const navEnlace = document.querySelectorAll(".nav-links a");
  navEnlace.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      if (navLinks && navLinks.classList.contains("active")) toggleMenu();
    });
  });

  // Pestañas Activas
  const allLinks = document.querySelectorAll(".nav-links a");
  allLinks.forEach((link) => {
    link.addEventListener("click", function () {
      allLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // =========================================
  // 2. ABRIR CARRITO DESDE HEADER
  // =========================================
  const cartButton = document.getElementById("cartButton");
  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }

  // =========================================
  // 3. CAPTURA DE BOTONES "AGREGAR"
  // =========================================
  const addButtons = document.querySelectorAll(".btn-add-cart");
  addButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btn = e.currentTarget;

      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");

      addToCart(id, name, price, image);

      const originalText = btn.innerHTML;
      btn.style.backgroundColor = "#28a745";
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡AÑADIDO!';

      setTimeout(() => {
        btn.style.backgroundColor = "#03254c";
        btn.innerHTML = originalText;
      }, 1000);
    });
  });

  // =========================================
  // 4. CARRUSEL DE COMBOS
  // =========================================
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const wrapper = document.querySelector(".slider-wrapper");

  if (track && wrapper) {
    const originalCards = Array.from(track.children);
    const totalOriginals = originalCards.length;

    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));

    let currentIndex = 0;
    let autoSlideTimer = null;

    function moveToSlide(index, animate = true) {
      if (!track.children[0]) return;
      const cardWidth = track.children[0].offsetWidth + 20;
      track.style.transition = animate
        ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
        : "none";
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      currentIndex = index;
    }

    track.addEventListener("transitionend", () => {
      if (currentIndex >= totalOriginals) {
        moveToSlide(currentIndex % totalOriginals, false);
      } else if (currentIndex < 0) {
        moveToSlide(totalOriginals + currentIndex, false);
      }
    });

    const nextSlide = () => moveToSlide(currentIndex + 1, true);
    const prevSlide = () => {
      if (currentIndex === 0) {
        const cardWidth = track.children[0].offsetWidth + 20;
        track.style.transition = "none";
        currentIndex = totalOriginals;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        track.offsetHeight;
      }
      moveToSlide(currentIndex - 1, true);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 4000);
    };
    const stopAutoSlide = () => {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });

    wrapper.addEventListener("mouseenter", stopAutoSlide);
    wrapper.addEventListener("mouseleave", startAutoSlide);
    startAutoSlide();
  }
});

// =========================================
// 5. SISTEMA Y LÓGICA DE CARRITO
// =========================================
let cart = [];

const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const headerCartTotal = document.getElementById("headerCartTotal");
const cartBadge = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clear-cart-btn");

function openCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  }
}

function closeCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
  }
}

if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

function updateCartUI() {
  if (!cartItemsContainer || !cartTotalPrice) return;

  cartItemsContainer.innerHTML = "";

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItemsCount;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="cart-empty-msg">Tu carrito está vacío</p>';
    cartTotalPrice.textContent = "S/ 0.00";
    if (headerCartTotal) headerCartTotal.textContent = "S/ 0.00";
    return;
  }

  let totalMoney = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalMoney += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-unit">S/ ${item.price.toFixed(2)} c/u</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <div class="cart-item-price">S/ ${itemTotal.toFixed(2)}</div>
        <button class="btn-remove-item" onclick="removeItem(${index})">Eliminar</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  const formattedTotal = `S/ ${totalMoney.toFixed(2)}`;
  cartTotalPrice.textContent = formattedTotal;
  if (headerCartTotal) {
    headerCartTotal.textContent = formattedTotal;
  }
}

function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  updateCartUI();
  openCart();
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
  });
}

// =========================================
// 6. LÓGICA DEL MODAL DE CHECKOUT & WHATSAPP
// =========================================
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const orderTypeSelect = document.getElementById("orderType");
const modalTotalPrice = document.getElementById("modalTotalPrice");
const checkoutForm = document.getElementById("checkoutForm");
const btnContinueOrder = document.getElementById("btnContinueOrder");

// Elementos Dinámicos
const takeoutGroup = document.getElementById("takeoutGroup");
const localGroup = document.getElementById("localGroup");
const localLocationType = document.getElementById("localLocationType");
const peopleCountGroup = document.getElementById("peopleCountGroup");
const tableNumGroup = document.getElementById("tableNumGroup");

const PHONE_NUMBER = "51964174746";

if (btnContinueOrder) {
  btnContinueOrder.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío. Agrega productos para continuar.");
      return;
    }

    const totalMoney = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (modalTotalPrice) {
      modalTotalPrice.textContent = `S/ ${totalMoney.toFixed(2)}`;
    }

    closeCart();
    if (checkoutOverlay) checkoutOverlay.classList.add("active");
  });
}

if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener("click", () => {
    if (checkoutOverlay) checkoutOverlay.classList.remove("active");
  });
}

// FUNCIÓN CENTRALIZADA PARA MOSTRAR/OCULTAR CAMPOS
function updateModalFields() {
  const orderType = orderTypeSelect ? orderTypeSelect.value : "";
  const locationType = localLocationType ? localLocationType.value : "";

  if (orderType === "Para llevar") {
    if (takeoutGroup) takeoutGroup.style.display = "block";
    if (localGroup) localGroup.style.display = "none";
  } else if (orderType === "Consumir en el local") {
    if (takeoutGroup) takeoutGroup.style.display = "none";
    if (localGroup) localGroup.style.display = "block";

    // Sub-opciones de local
    if (locationType === "En camino") {
      if (peopleCountGroup) peopleCountGroup.style.display = "block";
      if (tableNumGroup) tableNumGroup.style.display = "none";
    } else if (locationType === "En mesa") {
      if (peopleCountGroup) peopleCountGroup.style.display = "none";
      if (tableNumGroup) tableNumGroup.style.display = "block";
    }
  }
}

// ESCUCHAR CAMBIOS EN LOS SELECTORES
if (orderTypeSelect) {
  orderTypeSelect.addEventListener("change", updateModalFields);
}
if (localLocationType) {
  localLocationType.addEventListener("change", updateModalFields);
}

// ENVÍO DE FORMULARIO A WHATSAPP
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("clientName") ? document.getElementById("clientName").value : "";
    const orderType = orderTypeSelect ? orderTypeSelect.value : "";
    const locationTypeVal = localLocationType ? localLocationType.value : "";
    const obs = document.getElementById("orderObs") ? document.getElementById("orderObs").value : "";

    // Campos condicionales
    const pickupTime = document.getElementById("pickupTime") ? document.getElementById("pickupTime").value : "";
    const spicyLevel = document.getElementById("spicyLevel") ? document.getElementById("spicyLevel").value : "";
    const peopleCount = document.getElementById("peopleCount") ? document.getElementById("peopleCount").value : "";
    const tableNum = document.getElementById("tableNum") ? document.getElementById("tableNum").value : "";

    let totalMoney = 0;

    // Encabezado tipo Ticket
    let lines = [
      "🧾 TICKET DE PEDIDO — EVANS MARISQUERIA",
      "━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "👤 DATOS DEL CLIENTE",
      `• Nombre: ${name}`,
      `• Atención: ${orderType === "Para llevar" ? "🛍️ Para llevar" : "🍽️ Consumir en el local"}`
    ];

    // Datos específicos de la modalidad
    if (orderType === "Para llevar") {
      if (pickupTime) lines.push(`• Hora de recojo: ⏰ ${pickupTime}`);
      lines.push(`• Nivel de picante: 🌶️ ${spicyLevel}`);
    } else if (orderType === "Consumir en el local") {
      if (locationTypeVal === "En camino") {
        lines.push(`• Estado: 🚗 En camino al local`);
        if (peopleCount) lines.push(`• Separar mesa para: 👥 ${peopleCount} persona(s)`);
      } else if (locationTypeVal === "En mesa") {
        lines.push(`• Ubicación:* 🪑 Sentado en *Mesa ${tableNum || "por confirmar"}*`);
      }
    }

    lines.push("");
    lines.push("📋 *DETALLE DE CONSUMO*");

    // Recorrido de los productos
    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      totalMoney += subtotal;
      lines.push(` ▫️ ${item.quantity}x ${item.name} ── S/ ${subtotal.toFixed(2)}`);
    });

    // Observaciones (Solo si el cliente escribió algo)
    if (obs && obs.trim() !== "") {
      lines.push("");
      lines.push(`💬 *OBSERVACIONES:*`);
      lines.push(` _${obs}_`);
    }

    // Pie de página con Total limpio
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`💰 *TOTAL A PAGAR: S/ ${totalMoney.toFixed(2)}*`);
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("¡Gracias por tu pedido! En breve te atenderemos. 🐟");

    const summaryText = lines.join("\n");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(summaryText)}`;
    
    window.open(whatsappUrl, "_blank");
  });
}