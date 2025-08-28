let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("menu.json")
    .then(response => response.json())
    .then(data => renderMenu(data))
    .catch(error => showAlert("Failed to load menu!", "danger"));
});

function renderMenu(menuItems) {
  const menuContainer = document.getElementById("menuContainer");
  menuItems.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${item.image}" class="card-img-top" alt="${item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.price.toLocaleString("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2
}).replace("INR", "").trim()}
</p>
          <button class="btn btn-primary" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
        </div>
      </div>
    `;
    menuContainer.appendChild(col);
  });
}



function addToCart(id, name, price) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  showAlert(`${name} added to cart!`, "success");
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="list-group-item">Your cart is empty.</li>`;
    document.getElementById("checkoutSection").innerHTML = "";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        ₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}
      </div>
      <div>
        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  document.getElementById("checkoutSection").innerHTML = `
    <h5 class="mt-3">Total: ₹${total.toFixed(2)}</h5>
    <button class="btn btn-success mt-2" onclick="placeOrder()">Place Order</button>
  `;
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeFromCart(index) {
  const removedItem = cart.splice(index, 1)[0];
  showAlert(`${removedItem.name} removed from cart.`, "warning");
  updateCart();
}

function placeOrder() {
  if (cart.length === 0) {
    showAlert("Your cart is empty!", "danger");
    return;
  }

  const orderSummary = cart.map(item =>
    `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  alert(`Order Placed!\n\nItems:\n${orderSummary}\n\nThank you for ordering with TastyKart!`);
  cart = [];
  updateCart();
}

function showAlert(message, type) {
  const alertBox = document.getElementById("alertBox");
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 3000);

}
let currentUser = null;

function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    showAlert("Please enter both username and password.", "danger");
    return;
  }

  // For now, accept any username/password (or implement fixed credentials)
  currentUser = username;
  document.getElementById("userDisplayName").textContent = currentUser;
  document.getElementById("loginSection").classList.add("d-none");
  document.getElementById("userInfo").classList.remove("d-none");
  showAlert(`Welcome, ${currentUser}! You can now place orders.`, "success");
}

function logoutUser() {
  currentUser = null;
  document.getElementById("loginSection").classList.remove("d-none");
  document.getElementById("userInfo").classList.add("d-none");
  showAlert("You have been logged out.", "info");
}

function placeOrder() {
  if (!currentUser) {
    showAlert("You must log in to place an order.", "danger");
    return;
  }

  if (cart.length === 0) {
    showAlert("Your cart is empty!", "danger");
    return;
  }

  const orderSummary = cart.map(item =>
    `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  alert(`Order placed by ${currentUser}!\n\nItems:\n${orderSummary}\n\nThank you for ordering with TastyKart!`);

  cart = [];
  updateCart();
}

