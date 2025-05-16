let allProducts = [];
let cart = [];

function toggleCart() {
  const cartPopup = document.getElementById("cartPopup");
  cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
}

function addToCart(product) {
  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    existing.quantity += product.unit === "Kilogramo" ? 0.5 : 1;
  } else {
    cart.push({ ...product, quantity: product.unit === "Kilogramo" ? 0.5 : 1 });
  }
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    const subtotal = item.quantity * parseFloat(item.price);
    total += subtotal;
    count += item.quantity;

    const min = item.unit === "Kilogramo" ? 0.1 : 1;
    const step = item.unit === "Kilogramo" ? 0.1 : 1;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - 
      <input 
        type="number" 
        min="${min}" 
        step="${step}" 
        value="${item.quantity}" 
        onchange="changeQuantity(${index}, this.value, '${item.unit}')"
        onblur="if('${item.unit}' === 'Unidad' && this.value % 1 !== 0) this.value = Math.floor(this.value)">
      ${item.unit}
      ($${subtotal.toFixed(2)}) 
      <button onclick="removeFromCart(${index})" aria-label="Eliminar producto" style="background:none; border:none; cursor:pointer; padding:2px; vertical-align:middle;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width:20px; height:20px;">
          <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
        </svg>
      </button>
    `;
    cartItems.appendChild(li);
  });

  // Mostrar contador sin decimales ni paréntesis
  if (cart.length === 0) {
    cartCount.textContent = "";
  } else {
    const countDisplay = cart.length > 9 ? "9+" : cart.length;
    cartCount.textContent = countDisplay;
  }
  cartTotal.textContent = total.toFixed(2);
}

function changeQuantity(index, value, unit) {
  value = parseFloat(value);
  if (isNaN(value) || value <= 0) return;

  if (unit === "Unidad") {
    value = Math.floor(value);
  }

  cart[index].quantity = value;
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function sendWhatsApp() {
  if (cart.length === 0) return alert("El carrito está vacío.");
  let message = "Hola! Quiero hacer un pedido:\n\n";
  cart.forEach(item => {
    message += `${item.name} - ${item.quantity} ${item.unit}(s)\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);
  message += `\nTotal: $${total.toFixed(2)}`;
  const phone = "+5493446636978";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function renderProducts(products) {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <button onclick='addToCart(${JSON.stringify(p)})' style="width: 100%; padding: 20px; text-align: left;">
        <h3>${p.name}</h3>
        <p>Categoría: ${p.category}</p>
        <p>Precio: $${p.price} / ${p.unit}</p>
      </button>
    `;
    list.appendChild(div);
  });
}

function filterProducts() {
  const search = document.getElementById("search").value.toLowerCase();
  const selectedCategory = document.querySelector("#categoryList button.selected")?.dataset.category;
  const filtered = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesCategory = selectedCategory && selectedCategory !== "TODOS" ? p.category === selectedCategory : true;
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
      document.querySelectorAll("#categoryList button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      filterProducts();
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
