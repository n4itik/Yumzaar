import { menuArray } from "./data.js";

const cartItems = [];

// Event listener for handling clicks
document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    addToCart(e.target.dataset.add);
    e.target.disabled = true;
    toggleDisableButton(e.target);
    updateOrderHtml();
  } else if (e.target.dataset.remove) {
    removeFromCart(e.target.dataset.remove);
    updateOrderHtml();
  } else if (e.target.id === "order-btn") {
    handlePayment();
  }
});

// Function to add item to the cart
function addToCart(id) {
  const targetItemObj = menuArray.find((item) => item.id.toString() === id);
  cartItems.push(targetItemObj);
}

// Function to toggle disabled state of a button
function toggleDisableButton(button) {
  button.classList.toggle("disabled");
}

// Function to remove item from the cart
function removeFromCart(id) {
  const targetItemIndex = cartItems.findIndex(
    (item) => item.id.toString() === id
  );
  cartItems.splice(targetItemIndex, 1);

  const addToCartButton = document.querySelector(`[data-add="${id}"]`);
  addToCartButton.disabled = false;
  toggleDisableButton(addToCartButton);
}

// Function to generate HTML for the menu items
function getMenuHtml() {
  let menuHtml = "";

  menuArray.forEach((menuItem) => {
    menuHtml += `
      <div class="menu-item">
          <p class="emoji">${menuItem.emoji}</p>
          <div class="menu-item-details">
              <h2>${menuItem.name}</h2>
              <p class="ingredients">${menuItem.ingredients.join(", ")}</p>
              <p class="price">₹${menuItem.price}</p>
          </div>
          <button class="add-to-cart-btn" data-add="${menuItem.id}">+</button>
      </div>`;
  });
  return menuHtml;
}

// Function to generate HTML for the order
function getOrderHtml() {
  let orderHtml = "";

  if (cartItems.length > 0) {
    let orderItemsHtml = "";
    let totalPrice = 0;

    cartItems.forEach((item) => {
      orderItemsHtml += `
        <div class="order-item">
          <div>${item.name}<span data-remove="${item.id}">remove</span></div>
          <div class="price">₹${item.price}</div>
        </div>`;
      totalPrice += item.price;
    });

    orderHtml = `
      <h2>Your Order</h2>
      <div class="order-items">
        ${orderItemsHtml}
      </div>
      <div class="order-total">
        <div>Total price:</div>
        <div class="price">₹${totalPrice}</div>
      </div>
      <button id="order-btn">Complete Order</button>`;
  }
  return orderHtml;
}

// Function to update the order HTML
function updateOrderHtml() {
  document.getElementById("order").innerHTML = getOrderHtml();
}

// Function to handle the payment modal
function handlePayment() {
  let modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <h2>Enter card details</h2>
        <form>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            required
          />
          <input
            type="tel"
            id="card-number"
            name="card-number"
            placeholder="Enter card number"
            inputmode="numeric"
            pattern="[0-9\s]{12,16}"
            autocomplete="cc-number"
            maxlength="16"
            required
          />
          <input
            type="tel"
            id="cvv"
            name="cvv"
            placeholder="Enter CVV"
            inputmode="numeric"
            pattern="[0-9\s]{3,4}"
            autocomplete="cc-csc"
            maxlength="4"
            required
          />
          <input id="pay-btn" type="submit" value="Pay" />
        </form>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Event listener to handle clicks outside the modal
  document.addEventListener("click", function (e) {
    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal-content");
    // Check if the click target is outside the modal or its content
    if (
      e.target !== modal &&
      e.target !== modalContent &&
      !modalContent.contains(e.target)
    ) {
      modal.remove(); // Remove the modal from the DOM
      this.location.reload(); // Reload the page
    }
  });

  // Event listener to handle the payment form submission
  const payBtn = document.getElementById("pay-btn");
  payBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const cardNumber = document.getElementById("card-number").value;
    const cardNumberLength = Math.ceil(Math.log10(cardNumber + 1));
    const cvv = document.getElementById("cvv").value;
    const cvvLength = Math.ceil(Math.log10(cvv + 1));

    if (
      !name ||
      !(cardNumberLength >= 12) ||
      !(cardNumberLength <= 16) ||
      !(cvvLength >= 3) ||
      !(cvvLength <= 4)
    ) {
      alert("Please fill out all the fields correctly.");
      return false;
    }

    document.querySelector(".modal").remove();

    // Disable the add to cart buttons after payment
    const addToCartButtons = document.getElementsByClassName("add-to-cart-btn");
    for (let button of addToCartButtons) {
      button.disabled = true;
      button.classList.add("disabled");
    }

    // Show order completion message
    document.getElementById("order").innerHTML = `
      <div class="order-complete">
        Thanks, ${name}! Your order is on its way!
      </div>`;
  });
}

// Function to render the menu and order
function render() {
  document.getElementById("menu").innerHTML = getMenuHtml();
  updateOrderHtml();
}

// Initial rendering
render();
