let allProducts = [];
let cart = [];

function toggleCart() {
  const cartPopup = document.getElementById("cartPopup");
  cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
}



function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;

  /* === recorre el carrito y pinta cada producto === */
  cart.forEach((item, index) => {
    const subtotal = item.quantity * parseFloat(item.price);
    total += subtotal;

    const min  = item.unit === "Kilogramo" ? 0.1 : 1;
    const step = item.unit === "Kilogramo" ? 0.1 : 1;
    const imageSrc = item.image && item.image.trim() !== "" ? item.image : "data/default.jpeg";

    const li = document.createElement("li");
    li.className = "cart-item";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "16px";

    li.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}"
           style="width:200px;height:200px;object-fit:cover;border-radius:8px;flex-shrink:0;">
 <div style="display:flex;flex-direction:column;flex:1;">
  <span style="font-size:2rem;font-weight:600;margin-bottom:8px;">${item.name}</span>
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
    <input type="number"
           min="${min}" step="${step}" value="${item.quantity}"
           onchange="changeQuantity(${index}, this.value, '${item.unit}')"
           onblur="if('${item.unit}'==='Unidad' && this.value%1!==0) this.value=Math.floor(this.value)"
           style="
             width: 160px;
             height: 50px;
             padding: 14px 16px;
             font-size: 1.8rem;
             border: 2px solid #dd8e3f;
             border-radius: 12px;
             color: #a84a65;
             font-family: 'MADECarvingSoft', sans-serif;
             font-weight: 900;
             outline: none;
             box-sizing: border-box;
             transition: border-color 0.3s ease, box-shadow 0.3s ease;
           "
           onfocus="this.style.borderColor='#a84a65'; this.style.boxShadow='0 0 8px rgba(168, 74, 101, 0.6)';"
           onblur="this.style.borderColor='#dd8e3f'; this.style.boxShadow='none';"
           placeholder="Cantidad" >
    <span style="font-size:1.4rem;">${item.unit}</span>
  </div>
  <div style="font-size:3rem;font-weight:bold;color:#fff;">$${subtotal.toFixed(2)}</div>
</div>

  <button onclick="removeFromCart(${index})"
          aria-label="Eliminar producto"        
          style="background:none;border:none;cursor:pointer;padding:4px;">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
         style="width:62px;height:62px;color:white;">
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

  /* === total en $ === */
  cartTotal.textContent = total.toFixed(2);

  /* === burbuja del icono del carrito === */
  const distinctItems = cart.length;
  if (distinctItems === 0) {
    cartCount.textContent = "";
  } else if (distinctItems <= 9) {
    cartCount.textContent = distinctItems;
  } else {
    cartCount.textContent = "9+";
  }
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
    alert("El carrito está vacío.");
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

  /* --------- agrega dirección si existe --------- */
  const addressInput = document.getElementById("shippingAddress");
  if (addressInput && addressInput.value.trim() !== "") {
    message += `\nDirección de entrega: ${addressInput.value.trim()}`;
  }

  /* --------- envía por WhatsApp --------- */
  const phone = "+5493446636978";
  const url   = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}


function renderProducts(products) {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.style.position = "relative"; // para ubicar botón en esquina

    const imageSrc = p.image && p.image.trim() !== "" ? p.image : "data/default.jpeg";

    div.innerHTML = `
      <div onclick='openProductDetail(${JSON.stringify(p)})'
           style="display:flex; align-items:center; gap:20px; padding:20px; cursor:pointer;">
        <!-- Imagen -->
        <img src="${imageSrc}" alt="${p.name}"
             style="width:450px; height:450px; object-fit:cover; border-radius:8px;"
             onerror="this.onerror=null;this.src='data/default.jpeg';">

        <!-- Datos -->
        <div style="display:flex; flex-direction:column; justify-content:center;">
          <!-- Nombre grande -->
          <span style="font-size:2.5rem; font-weight:700; margin-bottom:4px;">
            ${p.name}
          </span>
          <!-- Categoría pequeña -->
          <span style="font-size:1rem; color:#d78a8f; margin-bottom:170px;">
            ${p.category}
          </span>
          
          <!-- Unidad -->
          <span style="font-size:2rem; color:#d78a8f; margin-bottom:24px;">
            ${p.unit}
          </span>
          
          <!-- Precio debajo -->
          <span style="font-size:5rem; font-weight:700;">
            $${p.price}
          </span>
        </div>
      </div>
    `;

    list.appendChild(div);
  });
}

function openProductDetail(product) {
  const modal = document.getElementById("productDetailModal");
  const content = document.getElementById("productDetailContent");

  // Inyectar estilos y @font-face
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @font-face {
      font-family: 'MADECarvingSoft';
      src: url('./fonts/MADECarvingSoftPERSONALUSE-Black.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    .product-detail-container {
      position: relative;
      padding: 40px;
      font-family: 'MADECarvingSoft';
      text-align: center;
    }
    .product-detail-container img {
      width: 800px; height: 800px;
      object-fit: cover;
      border-radius: 12px;
      margin: 0 auto 32px;
      display: block;
    }
    .product-detail-container h2 {
      margin-bottom: 16px;
      font-size: 4rem;
      color: #a84a65;
    }
    .product-detail-container p {
      font-size: 2.2rem;
      margin-bottom: 16px;
      color: #a84a65;
    }
    .close-detail-btn {
      position: absolute;
      top: 0px; left: 0px;
      background: #a84a65;
      color: white;
      border: none;
      border-radius: 50%;
      width: 100px; height: 100px;
      font-size: 5rem;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    .quantity-control {
      margin-bottom: 24px;
    }
    .quantity-control label {
      font-size: 2rem;
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
      width: 90px;
      height: 90px;
      border: none;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn svg {
      width: 2.25rem;
      height: 2.25rem;
    }
    #productDetailQty {
      width: 300px;
      text-align: center;
      font-size: 4.5rem;
      padding: 27px 0;
      border: none;
      outline: none;
      font-family: 'MADECarvingSoft';
      background: white;
    }
    .total-price {
      font-size: 4rem;
      font-weight: bold;
      margin-left: 40px;
      color: #a84a65;
    }
    .add-cart-wrapper {
      margin-top: 40px;
    }
    .add-cart-btn {
      background-color: #a84a65;
      color: white;
      border: 1px solid #dd8e3f;
      padding: 30px 60px;
      font-size: 3rem;
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

  const imageSrc = product.image && product.image.trim() !== "" ? product.image : "data/default.jpeg";

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

  // Eventos
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
}







function closeProductDetail() {
  document.getElementById("productDetailModal").style.display = "none";
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


function filterProducts() {
  /* ► asegura que el input tenga el estilo correcto */
  document.getElementById("search").className = "modern-input modern-input--wide";

  const search = document.getElementById("search").value.toLowerCase();
  const selectedCategory =
    document.querySelector("#categoryList button.selected")?.dataset.category;

  const filtered = allProducts.filter(p => {
    const matchesSearch   = p.name.toLowerCase().includes(search);
    const matchesCategory =
      selectedCategory && selectedCategory !== "TODOS"
        ? p.category === selectedCategory
        : true;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}


function loadProducts(products) {
  allProducts = products;
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
  // 1) marcar selección
  document.querySelectorAll("#categoryList button")
    .forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  

  // 2) filtrar productos
  filterProducts();

  // 3) cerrar el menú lateral
  toggleSidebar();
};
    catList.appendChild(btn);
  });
}

fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    loadProducts(products);
  })
  .catch(err => {
    console.error("Error cargando productos:", err);
  });
