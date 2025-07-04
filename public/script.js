let allProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 10;
let showingFavorites = false;




loadCartFromStorage();
updateCart();




// Abre el carrito y actualiza la URL con un hash (#cart)
function openCart() {
  const cartPopup = document.getElementById("cartPopup");
  cartPopup.style.display = "block";
  document.body.style.overflow = "hidden"; // Desactiva el scroll del fondo
  location.hash = "cart"; // Cambia la URL
}

// Cierra el carrito (y si hay hash, simula volver atrás)
function closeCart() {
  const cartPopup = document.getElementById("cartPopup");
  cartPopup.style.display = "none";
  document.body.style.overflow = "auto"; // Restaura el scroll

  if (location.hash === "#cart") {
    history.back(); // Simula botón "atrás"
  }
}



// Escucha el cambio en la URL (hash) para detectar botón atrás(CARRITO)
window.addEventListener("hashchange", () => {
  const cartPopup = document.getElementById("cartPopup");
  if (location.hash === "#cart") {
    cartPopup.style.display = "block";
  } else {
    cartPopup.style.display = "none";
  }
});

// Reemplaza tu función toggleCart con esta:
function toggleCart() {
  if (location.hash === "#cart") {
    closeCart(); // si ya estaba abierto, cerrar
  } else {
    openCart(); // si estaba cerrado, abrir
  }
}



function loadCartFromStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
    } catch (e) {
      console.error("Carrito corrupto en localStorage");
      cart = [];
    }
  }
}


function updateCart() {
  const isDesktop = window.innerWidth >= 1024;

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  document.getElementById("pickupCheckbox").addEventListener("change", updateCart);

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.quantity * parseFloat(item.price);
    total += subtotal;

    const min = item.unit === "Kilogramo" ? 0.1 : 1;
    const step = item.unit === "Kilogramo" ? 0.1 : 1;
    const imageSrc = item.image && item.image.trim() !== "" ? item.image : "https://i.imgur.com/XSvJsFZ.jpeg";

    const li = document.createElement("li");
    li.className = "cart-item";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = isDesktop ? "8px" : "16px";

    li.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}"
           style="width:${isDesktop ? '125px' : '250px'};height:${isDesktop ? '125px' : '250px'};object-fit:cover;border-radius:8px;flex-shrink:0;">
      <div style="display:flex;flex-direction:column;flex:1;">
        <span style="font-size:${isDesktop ? '1rem' : '2rem'};font-weight:600;margin-bottom:8px;">${item.name}</span>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
          <div style="
            display: flex;
            align-items: center;
            border: 2px solid #dd8e3f;
            border-radius: 12px;
            overflow: hidden;
            width: ${isDesktop ? '140px' : '280px'};
            background: #fff;
          ">
            <button class="qty-btn cart-minus-btn" data-index="${index}"
                    style="
                      border: none;
                      background: #fff;
                      color: #a84a65;
                      font-size: ${isDesktop ? '1.7rem' : '3.4rem'};
                      font-weight: 900;
                      cursor: pointer;
                      padding: 0 6px;
                      user-select: none;
                      height: ${isDesktop ? '25px' : '50px'};
                      line-height: 1;
                    ">−</button>
            <input type="number"
                   min="${min}" step="${step}" value="${item.quantity}"
                   onchange="changeQuantity(${index}, this.value, '${item.unit}')"
                   onblur="if('${item.unit}'==='Unidad' && this.value%1!==0) this.value=Math.floor(this.value)"
                   style="
                     width: ${isDesktop ? '80px' : '170px'};
                     height: ${isDesktop ? '40px' : '80px'};
                     padding: 0;
                     margin: 0;
                     font-size: ${isDesktop ? '1.5rem' : '3rem'};
                     font-family: 'MADECarvingSoft', sans-serif;
                     font-weight: 900;
                     color: #a84a65;
                     border: none;
                     outline: none;
                     text-align: center;
                     -moz-appearance: textfield;
                   "
                   onfocus="this.style.outline='none';"
                   placeholder="Cantidad" >
            <button class="qty-btn cart-plus-btn" data-index="${index}"
                    style="
                      border: none;
                      background: #fff;
                      color: #a84a65;
                      font-size: ${isDesktop ? '1.7rem' : '3.4rem'};
                      font-weight: 900;
                      cursor: pointer;
                      padding: 0 6px;
                      user-select: none;
                      height: ${isDesktop ? '25px' : '50px'};
                      line-height: 1;
                    ">+</button>
          </div>
          <span style="font-size:${isDesktop ? '0.8rem' : '1.6rem'};">${item.unit}</span>
        </div>
        <div style="font-size:${isDesktop ? '1.5rem' : '3rem'};font-weight:bold;color:#fff;">$${subtotal.toFixed(2)}</div>
      </div>

      <button onclick="removeFromCart(${index})"
              aria-label="Eliminar producto"        
              style="background:none;border:none;cursor:pointer;padding:4px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             style="width:${isDesktop ? '31px' : '62px'};height:${isDesktop ? '31px' : '62px'};color:white;">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                   c.342.052.682.107 1.022.166m-1.022-.165
                   L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084
                   a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0
                   a48.108 48.108 0 0 0-3.478-.397m-12 .562
                   c.34-.059.68-.114 1.022-.165m0 0
                   a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916
                   c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0
                   c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0
                   a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);

  const shippingCostText = document.getElementById("shippingCostText");
  const pickupCheckbox = document.getElementById("pickupCheckbox");
  const shippingInput = document.getElementById("shippingAddress");

  if (pickupCheckbox && shippingCostText) {
    if (pickupCheckbox.checked) {
      shippingCostText.innerHTML = `
        <span style="color: #dd8e3f;  font-family: 'MadeCarving', sans-serif;">10% OFF EN EFECTIVO </span><br>
        <span style="color: #dd8e3f;  font-family: 'MadeCarving', sans-serif; font-size: 26px;">(Pellegrini 18)</span>
      `;
      if (shippingInput) {
        shippingInput.style.display = "none";
        shippingInput.value = "";
      }
    } else {
      shippingCostText.innerHTML = total >= 35000
        ? '<span style="color: #dd8e3f; font-weight: bold;">ENVÍO GRATIS <span style="font-family: \'MadeCarving\', sans-serif; font-size: 0.7em;">(solo zona Gualeguaychú)</span></span>'
        : '<span style="color: #a84a65; font-weight: bold; font-family: \'MadeCarving\', sans-serif;">Envio a cargo del comprador</span>';
      if (shippingInput) shippingInput.style.display = "block";
    }
  }

  const distinctItems = cart.length;
  cartCount.textContent = distinctItems === 0 ? "" : distinctItems <= 9 ? distinctItems : "9+";

  document.querySelectorAll(".cart-minus-btn").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      let currentQty = parseFloat(cart[idx].quantity);
      const step = cart[idx].unit === "Kilogramo" ? 0.1 : 1;
      currentQty = Math.max(step, currentQty - step);
      cart[idx].quantity = parseFloat(currentQty.toFixed(2));
      updateCart();
    };
  });

  document.querySelectorAll(".cart-plus-btn").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      let currentQty = parseFloat(cart[idx].quantity);
      const step = cart[idx].unit === "Kilogramo" ? 0.1 : 1;
      currentQty = Math.min(100, currentQty + step);
      cart[idx].quantity = parseFloat(currentQty.toFixed(2));
      updateCart();
    };
  });

  localStorage.setItem("cart", JSON.stringify(cart));
}







function changeQuantity(index, value, unit) {
  value = parseFloat(value);

  /* ❌ valor no numérico */
  if (isNaN(value)) return;

  /* 🔽 límite mínimo */
  if (unit === "Unidad") {
    value = Math.floor(value);      // siempre entero
    if (value < 1) value = 1;       // mínimo 1
  } else {
    if (value < 0.1) value = 0.1;   // mínimo 0.1 Kg
  }

  /* 🔼 límite máximo */
  if (value > 100) value = 100;

  cart[index].quantity = value;
  updateCart();
}



function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function sendWhatsApp() {
  if (cart.length === 0) {
    showToast('<span style="color: white;">El carrito está vacío.</span>', "#a61f4d");
    return;
  }
  /* --------- arma el mensaje --------- */
  let message = "Hola! Quiero hacer un pedido:\n\n";
  cart.forEach(item => {
    message += `${item.name} - ${item.quantity} ${item.unit}(s)\n`;
  });

  const total = cart.reduce((sum, item) =>
    sum + item.quantity * parseFloat(item.price), 0);
  message += `\nTotal: $${total.toFixed(2)}\n`;

  /* --------- determina si es retiro o envío --------- */
  const pickupCheckbox = document.getElementById("pickupCheckbox");
  const addressInput = document.getElementById("shippingAddress");

  if (pickupCheckbox && pickupCheckbox.checked) {
    message += `\nRetira en Pellegrini 18`;
  } else if (addressInput && addressInput.value.trim() !== "") {
    message += `\nDirección de entrega: ${addressInput.value.trim()}`;
  } else {
    message += `\nDirección de entrega: no especificada`;
  }

  /* --------- envía por WhatsApp --------- */
  const phone = "+5493446636978";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  // 👉 Vacía el carrito y actualiza la vista
  cart = [];
  updateCart();
}

/***FAVORITOS Y RENDER PRODUCT */

let favorites = [];

function loadFavorites() {
  const stored = localStorage.getItem("favorites");
  favorites = stored ? JSON.parse(stored) : [];
}
loadFavorites();

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function showToast(message, backgroundColor = "#7a1f4296", textColor = "#fff") {
  const toast = document.getElementById("toast");

  toast.innerHTML = message;
   // Ajustar tamaño según ancho de pantalla
  if (window.innerWidth <= 1024) {
    toast.style.fontSize = "2.2rem";
  } else {
    toast.style.fontSize = "1rem";
  }
  toast.style.padding = "20px 40px";
  toast.style.borderRadius = "12px";
  toast.style.maxWidth = "80%";
  toast.style.textAlign = "center";
  toast.style.backgroundColor = backgroundColor;
  toast.style.color = textColor;
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2500);
}





function toggleFavorite(product) {
  const index = favorites.findIndex(f => f.name === product.name);

  const filledHeart = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
         style="width:40px;height:40px;margin-right:8px;vertical-align:middle;">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733
               -.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25
               c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>`;

  const brokenHeart = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
         style="width:40px;height:40px;margin-right:8px;vertical-align:middle;color:white;">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
               c.342.052.682.107 1.022.166m-1.022-.165
               L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084
               a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0
               a48.108 48.108 0 0 0-3.478-.397m-12 .562
               c.34-.059.68-.114 1.022-.165m0 0
               a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916
               c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0
               c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0
               a48.667 48.667 0 0 0-7.5 0" />
    </svg>`;

  if (index !== -1) {
    favorites.splice(index, 1);
    showToast(`${brokenHeart}${product.name} se eliminó de favoritos`, "#8a8a8ecc", "#fff");  // gris claro
  } else {
    favorites.push(product);
    showToast(`${filledHeart}${product.name} se agregó a favoritos`, "#7a1f4296", "#fff"); // bordo
  }

  saveFavorites();
  updateFavoriteIcons();
}




function updateFavoriteIcons() {
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    const name = btn.getAttribute("data-name");
    const isFavorite = favorites.some(f => f.name === name);
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", isFavorite ? "#a61f4d" : "none");
    }
  });
}

/**** OCULTAR PUBLICIDAD  */
function ocultarPublicidadYExpandirContenido() {
  const promo = document.querySelector(".promo-image");
  const content = document.querySelector(".content");

  if (promo) {
    promo.style.display = "none";
  }

  if (content) {
    if (window.innerWidth > 1024) {
      content.style.marginTop = "150px";  // PC
    } else {
      content.style.marginTop = "400px";  // Móvil/Tablet
    }
  }
}

/**** mostrar  */

function mostrarPublicidadYRestaurarMargen() {
  const promo = document.querySelector(".promo-image");
  const productos = document.querySelectorAll(".product");
  const content = document.querySelector(".content");

  document.getElementById("unitFilter").value = "";
  document.getElementById("priceFilter").value = "";
  document.getElementById("search").value = "";

  // Detectar si estamos en PC o celular
  const isDesktop = window.innerWidth >= 1024;

  // Seleccionar el producto correspondiente con publicidad
  const index = isDesktop ? 1 : 0;
  const prodConPublicidad = allProducts[index];

  // Si existe y tiene publicidad, cambiar la imagen
  if (prodConPublicidad?.publicidad && promo?.querySelector("img")) {
    promo.querySelector("img").src = prodConPublicidad.publicidad;
  }

  // Mostrar la promo
  if (promo) {
    promo.style.display = "block";
  }

  // Restaurar margen superior
  if (content) {
    content.style.marginTop = "0px";
  }

  // Ocultar todos los productos
  productos.forEach(producto => {
    producto.style.display = "none";
  });

  // Salir del modo favoritos
  showingFavorites = false;
  document.querySelector(".favorites-button")?.classList.remove("selected");

  // Cambiar el icono del corazón a "sin pintar"
  const favBtnIcon = document.querySelector(".favorites-button svg");
  if (favBtnIcon) {
    favBtnIcon.setAttribute("fill", "none");
  }

  // Quitar selección de categorías
  document.querySelectorAll("#categoryList button")
    .forEach(b => b.classList.remove("selected"));
}





function renderProducts(products) {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const screenWidth = window.innerWidth;
  const isDesktop = screenWidth > 1024;
  const isLargeDesktop = screenWidth >= 1920;

  // Cambiar layout del contenedor padre según dispositivo
  list.style.display = isDesktop ? "grid" : "block";

  if (isLargeDesktop) {
    list.style.gridTemplateColumns = "68% 68% 68%";
  } else if (isDesktop) {
    list.style.gridTemplateColumns = "71% 71%";
  } else {
    list.style.gridTemplateColumns = "auto";
  }

  list.style.gap = isDesktop ? "20px" : "0";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.style.position = "relative";
    div.style.width = "auto";  // El grid define el ancho

    const imageSrc = p.image && p.image.trim() !== "" ? p.image : "https://i.imgur.com/p4tHxub.jpeg";
    const isFavorite = favorites.some(f => f.name === p.name);

    const favButton = document.createElement("button");
    favButton.className = "favorite-btn";
    favButton.setAttribute("data-name", p.name);
    favButton.style.cssText = `
      position:absolute;
      top:${isDesktop ? "5px" : "10px"};
      right:${isDesktop ? "5px" : "10px"};
      background:none;
      border:none;
      cursor:pointer;
      padding:${isDesktop ? "2px" : "5px"};
    `;
    favButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="${isFavorite ? "#a61f4d" : "none"}"
           viewBox="0 0 24 24" stroke-width="1.5" stroke="#a61f4d"
           width="${isDesktop ? "35" : "62"}" height="${isDesktop ? "35" : "62"}">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                 -1.935 0-3.597 1.126-4.312 2.733
                 -.715-1.607-2.377-2.733-4.313-2.733
                 C5.1 3.75 3 5.765 3 8.25c0 7.22
                 9 12 9 12s9-4.78 9-12Z"/>
      </svg>`;

    favButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(p);
    });

    const mainContent = document.createElement("div");
    mainContent.style.cssText = `
      display:flex;
      align-items:flex-start;
      gap:${isDesktop ? "10px" : "20px"};
      padding:${isDesktop ? "10px" : "20px"};
      cursor:pointer;
      width: 100%;
    `;
    mainContent.addEventListener("click", () => openProductDetail(p));

    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = p.name;
    img.style.cssText = `
      width:${isDesktop ? "225px" : "450px"};
      height:${isDesktop ? "225px" : "450px"};
      object-fit:cover;
      border-radius:8px;
    `;
    img.onerror = function () {
      this.onerror = null;
      this.src = 'data/default.jpeg';
    };

    const info = document.createElement("div");
    info.style.cssText = `
      display:flex;
      flex-direction:column;
      flex:1;
      height:${isDesktop ? "225px" : "450px"};
    `;

    info.innerHTML = `
      <span style="font-size:${isDesktop ? "1.25rem" : "2.5rem"}; font-weight:700; line-height:1.2; word-wrap:break-word; margin-bottom:8px;">
        ${p.name}
      </span>
      <span style="font-size:${isDesktop ? "0.7rem" : "1.1rem"}; color:#d78a8f; margin-bottom:auto;">
        ${p.category}
      </span>
      <div style="margin-top:auto;">
        <span style="display:block; font-size:${isDesktop ? "1rem" : "2rem"}; color:#d78a8f; margin-bottom:12px;">
          ${p.unit}
        </span>
        <span style="display:block; font-size:${isDesktop ? "2.5rem" : "5rem"}; font-weight:700;">
          $${p.price}
        </span>
      </div>
    `;

    mainContent.appendChild(img);
    mainContent.appendChild(info);

    div.appendChild(favButton);
    div.appendChild(mainContent);
    list.appendChild(div);
  });

  updateFavoriteIcons();
}




/***FILTROS PRODUCTOS */
document.getElementById("filterButton").addEventListener("click", () => {
  const menu = document.getElementById("filterMenu");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
});

function applyFilters(products = null) {
  const unit = document.getElementById("unitFilter").value;
  const priceOrder = document.getElementById("priceFilter").value;
   ocultarPublicidadYExpandirContenido()
  // Si está activada la vista de favoritos, la desactivamos
  if (showingFavorites) {
    showingFavorites = false;

    // Despintar el corazón
    const btn = document.querySelector(".favorites-button svg");
    btn.setAttribute("fill", "none");
  }

  // Determinar la base de productos a filtrar
  if (!products) {
    const search = document.getElementById("search").value.toLowerCase();
    const selectedCategory =
      document.querySelector("#categoryList button.selected")?.dataset.category;

    let baseList = allProducts;

    if (search) {
      products = baseList.filter(p =>
        p.name.toLowerCase().includes(search)
      );
    } else if (selectedCategory && selectedCategory !== "TODOS") {
      products = baseList.filter(p =>
        p.category === selectedCategory
      );
    } else {
      products = [...baseList];
    }
  }

  let filtered = [...products];

  if (unit) {
    filtered = filtered.filter(p => p.unit === unit);
  }

  if (priceOrder === "asc") {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (priceOrder === "desc") {
    filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  renderProducts(filtered);
  
}



document.getElementById("unitFilter").addEventListener("change", () => applyFilters());
document.getElementById("priceFilter").addEventListener("change", () => applyFilters());

function clearFilters() {
  document.getElementById("unitFilter").value = "";
  document.getElementById("priceFilter").value = "";
  filterProducts();

  const menu = document.getElementById("filterMenu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  }
}


/**-----PAGINACION */

function renderPaginationControls(totalProducts) {
  const pagination = document.getElementById("paginationControls");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (totalPages <= 1) return;

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.onclick = () => renderProducts(currentFilteredProducts, currentPage - 1);
    pagination.appendChild(prevBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.onclick = () => renderProducts(currentFilteredProducts, currentPage + 1);
    pagination.appendChild(nextBtn);
  }
}


// Mostrar solo favoritos
function showFavoritesList() {
  renderProducts(favorites);
}


function clearFiltersForFavorites() {
  // Limpiamos valores visuales de filtros
  document.getElementById("unitFilter").value = "";
  document.getElementById("priceFilter").value = "";

  // Cerramos menú de filtros si está abierto
  const menu = document.getElementById("filterMenu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  }

  // Opcional: limpiar también búsqueda y categoría seleccionada
  document.getElementById("search").value = "";

  const selectedCategory = document.querySelector("#categoryList button.selected");
  if (selectedCategory) {
    selectedCategory.classList.remove("selected");
  }
}


function toggleFavorites() {
  const btn = document.querySelector(".favorites-button svg");
  ocultarPublicidadYExpandirContenido()
  showingFavorites = !showingFavorites;

  if (showingFavorites) {
    clearFiltersForFavorites(); // No aplica filtros
    renderProducts(favorites);
    btn.setAttribute("fill", "white");

    // 👉 Guardar en el historial que se activó favoritos
    history.pushState({ favoritesOpen: true }, "");
  } else {
    renderProducts(allProducts);
    btn.setAttribute("fill", "none");
  }
}

window.addEventListener("popstate", () => {
  const btn = document.querySelector(".favorites-button svg");

  // Si estaba en modo favoritos, salir
  if (showingFavorites) {
    showingFavorites = false;
    renderProducts(allProducts);
    btn.setAttribute("fill", "none");
  }

  // (opcional: cerrar sidebar si querés)
  const sidebar = document.getElementById("sidebar");
  if (sidebar?.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});





function openProductDetail(product) {

  // Desactivar scroll de fondo
document.body.style.overflow = "hidden";

  const modal = document.getElementById("productDetailModal");
  const content = document.getElementById("productDetailContent");

  const isDesktop = window.innerWidth >= 1024;

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @font-face {
      font-family: 'MADECarvingSoft';
      src: url('./fonts/MADECarvingSoftPERSONALUSE-Black.otf') format('opentype');
    }
    .product-detail-container {
      position: relative;
      padding: ${isDesktop ? '20px' : '40px'};
      font-family: 'MADECarvingSoft';
      text-align: center;
    }
    .product-detail-container img {
      width: ${isDesktop ? '600px' : '800px'};
      height: ${isDesktop ? '400px' : '800px'};
      object-fit: cover;
      border-radius: 12px;
      margin: 0 auto 32px;
      display: block;
    }
    .product-detail-container h2 {
      margin-bottom: 16px;
      font-size: ${isDesktop ? '2rem' : '4rem'};
      color: #a84a65;
    }
    .product-detail-container p {
      font-size: ${isDesktop ? '1.1rem' : '2.2rem'};
      margin-bottom: 16px;
      color: #a84a65;
    }
    .close-detail-btn {
      position: absolute;
      top: 0px;
      left: 0px;
      background: #a84a65;
      color: white;
      border: none;
      border-radius: 50%;
      width: ${isDesktop ? '50px' : '100px'};
      height: ${isDesktop ? '50px' : '100px'};
      font-size: ${isDesktop ? '2.5rem' : '5rem'};
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    .quantity-control {
      margin-bottom: ${isDesktop ? '12px' : '24px'};
    }
    .quantity-control label {
      font-size: ${isDesktop ? '1rem' : '2rem'};
      font-weight: bold;
      color: #a84a65;
    }
    .qty-input-wrapper {
      display: inline-flex;
      align-items: center;
      margin-left: 12px;
      border: 1px solid #ccc;
      border-radius: 12px;
      overflow: hidden;
      background: white;
    }
    .qty-btn {
      width: ${isDesktop ? '45px' : '90px'};
      height: ${isDesktop ? '45px' : '90px'};
      border: none;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn svg {
      width: ${isDesktop ? '1.125rem' : '2.25rem'};
      height: ${isDesktop ? '1.125rem' : '2.25rem'};
    }
    #productDetailQty {
      width: ${isDesktop ? '100px' : '300px'};
      text-align: center;
      font-size: ${isDesktop ? '2rem' : '4.5rem'};
      padding: ${isDesktop ? '5px 0' : '27px 0'};
      border: none;
      outline: none;
      font-family: 'MADECarvingSoft';
      background: white;
    }
    .total-price {
      font-size: ${isDesktop ? '2rem' : '4rem'};
      font-weight: bold;
      margin-left: 40px;
      color: #a84a65;
    }
    .add-cart-wrapper {
      margin-top: ${isDesktop ? '20px' : '40px'};
    }
    .add-cart-btn {
      background-color: #a84a65;
      color: white;
      border: 1px solid #dd8e3f;
      padding: ${isDesktop ? '15px 30px' : '30px 60px'};
      font-size: ${isDesktop ? '1.5rem' : '3rem'};
      border-radius: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      box-shadow: 0 8px 10px rgba(168, 74, 101, 0.4);
      font-family: 'MADECarvingSoft';
    }
  `;
  const prev = document.getElementById('product-detail-styles');
  if (prev) prev.remove();
  styleTag.id = 'product-detail-styles';
  document.head.appendChild(styleTag);

  const imageSrc = product.image && product.image.trim() !== "" ? product.image : "https://i.imgur.com/p4tHxub.jpeg";

  content.innerHTML = `
    <div class="product-detail-container">
      <button id="closeDetailBtn" class="close-detail-btn">×</button>
      <h2>${product.name}</h2>
      <img src="${imageSrc}" alt="${product.name}" />
      <p>Precio unitario: <strong>$${parseFloat(product.price).toFixed(2)}</strong> / ${product.unit}</p>
      <div class="quantity-control">
        <label for="productDetailQty">Cantidad:</label>
        <div class="qty-input-wrapper">
          <button id="minusBtn" class="qty-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <input id="productDetailQty" type="number"
            value="${product.unit === 'Kilogramo' ? 0.1 : 1}"
            step="${product.unit === 'Kilogramo' ? 0.1 : 1}"
            min="${product.unit === 'Kilogramo' ? 0.1 : 1}"
            max="100" />
          <button id="plusBtn" class="qty-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <span id="dynamicPrice" class="total-price">$${parseFloat(product.price).toFixed(2)}</span>
      </div>
      <div class="add-cart-wrapper">
        <button id="addToCartBtn" class="add-cart-btn">AGREGAR AL CARRITO</button>
      </div>
    </div>
  `;
  modal.style.display = "flex";

  document.getElementById("closeDetailBtn").onclick = closeProductDetail;

  const qtyInput = document.getElementById("productDetailQty");
  const priceSpan = document.getElementById("dynamicPrice");
  const addBtn = document.getElementById("addToCartBtn");
  const minusBtn = document.getElementById("minusBtn");
  const plusBtn = document.getElementById("plusBtn");

  function updatePrice() {
    let qty = parseFloat(qtyInput.value);
    if (isNaN(qty) || qty < parseFloat(qtyInput.min) || qty > 100) {
      priceSpan.textContent = "$0.00";
      addBtn.disabled = true;
      addBtn.style.opacity = 0.6;
    } else {
      if (product.unit === "Unidad") {
        qty = Math.floor(qty);
        qtyInput.value = qty;
      }
      const totalPrice = qty * parseFloat(product.price);
      priceSpan.textContent = `$${totalPrice.toFixed(2)}`;
      addBtn.disabled = false;
      addBtn.style.opacity = 1;
    }
  }

  minusBtn.addEventListener("click", () => {
    let step = parseFloat(qtyInput.step);
    let val = parseFloat(qtyInput.value) - step;
    if (val < parseFloat(qtyInput.min)) val = parseFloat(qtyInput.min);
    qtyInput.value = val.toFixed(product.unit === "Kilogramo" ? 1 : 0);
    updatePrice();
  });

  plusBtn.addEventListener("click", () => {
    let step = parseFloat(qtyInput.step);
    let val = parseFloat(qtyInput.value) + step;
    if (val > parseFloat(qtyInput.max)) val = parseFloat(qtyInput.max);
    qtyInput.value = val.toFixed(product.unit === "Kilogramo" ? 1 : 0);
    updatePrice();
  });

  qtyInput.addEventListener("input", updatePrice);
  updatePrice();

  addBtn.onclick = () => addToCartFromDetail(product);

  history.pushState({ modalOpen: true }, "", "#detalle");
}

window.addEventListener("popstate", (event) => {
  const modal = document.getElementById("productDetailModal");
  if (modal && modal.style.display === "flex") {
    closeProductDetail();
  }
});





function closeProductDetail() {

    // Restaurar scroll de fondo
  document.body.style.overflow = "auto";

  const modal = document.getElementById("productDetailModal");
  modal.style.display = "none";

  // Eliminar estilos inyectados si existen
  const styleTag = document.getElementById('product-detail-styles');
  if (styleTag) styleTag.remove();

  // Si el hash es "#detalle", retroceder en el historial
  if (location.hash === "#detalle") {
    history.back();
  }
}

function addToCartFromDetail(product) {
  const qtyInput = document.getElementById("productDetailQty");
  let qty = parseFloat(qtyInput.value);
  if (isNaN(qty) || qty <= 0) {
    alert("Ingrese una cantidad válida.");
    return;
  }
  if (product.unit === "Unidad") {
    qty = Math.floor(qty);
  }

  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }
  updateCart();
  closeProductDetail();
}


// CIERRE .SIDEBAR DESLIZANDO

let fuse; // Global

function setupFuse(products) {
  const options = {
    keys: ['name'],
    threshold: 0.4, // Podés ajustar esto: 0.2 = más exacto, 0.5 = más permisivo
  };
  fuse = new Fuse(products, options);
}


let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}, false);

function handleSwipeGesture() {
  const sidebar = document.querySelector(".sidebar");
  const isOpen = sidebar.classList.contains("open");
  const swipeDistance = touchEndX - touchStartX;

  // Si la barra no está abierta y el usuario desliza hacia la derecha
  if (!isOpen && swipeDistance > 70 && touchStartX < 80) {
    sidebar.classList.add("open");
  }

  // Si está abierta y el usuario desliza hacia la izquierda
  if (isOpen && swipeDistance < -70) {
    sidebar.classList.remove("open");
  }
}

// -------------------------------------------

function filterProducts() {
  document.getElementById("search").className = "modern-input modern-input--wide";

  const search = document.getElementById("search").value.toLowerCase();
  const selectedCategory =
    document.querySelector("#categoryList button.selected")?.dataset.category;

  let baseProducts;

  if (search) {
    // Cancelar favoritos
    showingFavorites = false;
    document.querySelector(".favorites-button")?.classList.remove("selected");

    const favBtnIcon = document.querySelector(".favorites-button svg");
    if (favBtnIcon) {
      favBtnIcon.setAttribute("fill", "none");
    }

    // Búsqueda flexible con Fuse.js
    const results = fuse.search(search);
    baseProducts = results.map(r => r.item);

  } else if (selectedCategory && selectedCategory !== "TODOS") {
    baseProducts = allProducts.filter(p => p.category === selectedCategory);
  } else {
    baseProducts = [...allProducts];
  }

  applyFilters(baseProducts);
}



///----

function loadProducts(products) {
  allProducts = products;
  setupFuse(products); // 🔥 Preparar Fuse.js

  renderProducts(products);

  const categories = ["TODOS", ...new Set(products.map(p => p.category))];
  
  const catList = document.getElementById("categoryList");
  catList.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.style.display = "block";
    btn.style.marginBottom = "5px";

    btn.onclick = () => {
      document.querySelectorAll("#categoryList button")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      document.getElementById("search").value = "";

      showingFavorites = false;
      document.querySelector(".favorites-button")?.classList.remove("selected");

      const favBtnIcon = document.querySelector(".favorites-button svg");
      if (favBtnIcon) {
        favBtnIcon.setAttribute("fill", "none");
      }

      filterProducts();
      toggleSidebar();
    };

    catList.appendChild(btn);
  });
}


///----
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const isOpen = sidebar.classList.contains("open");

  if (!isOpen) {
    sidebar.classList.add("open");

    // Empujamos un nuevo estado al historial
    history.pushState({ sidebarOpen: true }, "");
  } else {
    sidebar.classList.remove("open");

    // Volver al estado anterior si el sidebar estaba abierto
    if (history.state?.sidebarOpen) {
      history.back();
    }
  }
}

window.addEventListener("popstate", (event) => {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  }
});


function actualizarPublicidad(products) {
  const imgPublicidad = document.getElementById("publicidad-img");
  
  if (!imgPublicidad) return; // Por si no existe el elemento

  // Buscamos la primera publicidad que no sea vacía
  const productoConPublicidad = products.find(p => p.publicidad && p.publicidad.trim() !== "");

  if (productoConPublicidad) {
    const nuevaURL = productoConPublicidad.publicidad.trim();
    if (imgPublicidad.src !== nuevaURL) {
      imgPublicidad.src = nuevaURL;
    }
  }
}



  // ---------------------------

fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    loadProducts(products);          // Tu función que carga productos en pantalla
    actualizarPublicidad(products);  // Actualiza el src de la imagen de publicidad
    mostrarPublicidadYRestaurarMargen();
  })
  .catch(err => {
    console.error("Error cargando productos:", err);
  });

  // Al cargar la página, cargamos la dirección guardada (si existe)
window.addEventListener('DOMContentLoaded', () => {
  const inputAddress = document.getElementById('shippingAddress');
  const savedAddress = localStorage.getItem('shippingAddress');
  if (savedAddress) {
    inputAddress.value = savedAddress;
  }

  // Guardar la dirección cada vez que cambia el input
  inputAddress.addEventListener('input', () => {
    localStorage.setItem('shippingAddress', inputAddress.value);
  });
});

