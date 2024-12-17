let selectedMenu = [];

const fetchMenus = async () => {
  const response = await fetch(
    "https://faris-rafi.github.io/product-list-with-cart-main_frontend-mentor/data.json"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const datas = await response.json();

  const items = document.getElementById("menus");
  return datas.map((menu) => {
    const itemCard = document.createElement("div");
    menu.id = Date.now() + "_" + Math.floor(Math.random() * 10000);
    itemCard.classList.add("item-card");
    itemCard.innerHTML = `
      <div id="${menu.id}-image-button" class="image-button">
        <img
          id="${menu.id}-img-desktop"
          class="img-desktop"
          src="${menu.image.desktop}"
          alt="Waffle"
        />
        <img
          id="${menu.id}-img-tablet"
          class="img-tablet"
          src="${menu.image.tablet}"
          alt="Waffle"
        />
        <img
          id="${menu.id}-img-mobile"
          class="img-mobile"
          src="${menu.image.mobile}"
          alt="Waffle"
        />
        <button
          id="${menu.id}-button"
          class="add-to-cart-button"
          onclick='addToCart(${JSON.stringify(menu)}, "new")'
        >
          <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart" />
          <span> Add to Cart </span>
        </button>
      </div>
      <div class="sub-text">
        <small>${menu.category}</small>
        <span class="sub-title">${menu.name}</span>
        <span class="price">$${menu.price.toFixed(2)}</span>
      </div>
    `;

    items.appendChild(itemCard);
  });
};

fetchMenus();

const addToCart = (menu, type) => {
  const selectedImageDesktop = document.getElementById(
    `${menu.id}-img-desktop`
  );
  const selectedImageTablet = document.getElementById(`${menu.id}-img-tablet`);
  const selectedImageMobile = document.getElementById(`${menu.id}-img-mobile`);
  const existingItem = selectedMenu.find((item) => item.id === menu.id);

  if (existingItem) {
    if (type === "increment") {
      existingItem.quantity += 1;
      selectedImageDesktop.classList.add("selected-item");
      selectedImageTablet.classList.add("selected-item");
      selectedImageMobile.classList.add("selected-item");
    } else if (type === "decrement") {
      existingItem.quantity -= 1;

      if (existingItem.quantity <= 0) {
        selectedMenu = selectedMenu.filter((item) => item.id !== menu.id);
        selectedImageDesktop.classList.remove("selected-item");
        selectedImageTablet.classList.remove("selected-item");
        selectedImageMobile.classList.remove("selected-item");
      }
    } else {
      selectedMenu = selectedMenu.filter((item) => item.id !== menu.id);
      selectedImageDesktop.classList.remove("selected-item");
      selectedImageTablet.classList.remove("selected-item");
      selectedImageMobile.classList.remove("selected-item");
    }
  } else {
    selectedImageDesktop.classList.add("selected-item");
    selectedImageTablet.classList.add("selected-item");
    selectedImageMobile.classList.add("selected-item");
    selectedMenu.push({
      ...menu,
      quantity: 1,
    });
  }

  const addToCartDiv = document.getElementById(`${menu.id}-image-button`);
  const addToCartButton = document?.getElementById(`${menu.id}-button`);

  if (selectedMenu.find((item) => item.id === menu.id)) {
    const html = `
      <div 
        class="svg"
        onclick='addToCart(${JSON.stringify(menu)}, "decrement")'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 2">
          <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
        </svg>
      </div>
            
      <span> 
        ${selectedMenu.find((item) => item.id === menu.id).quantity} 
      </span>
             
      <div 
        class="svg" 
        onclick='addToCart(${JSON.stringify(menu)}, "increment")'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
          <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
        </svg>
      </div>
    `;

    if (type === "new") {
      const selectedButton = document.createElement("button");
      selectedButton.classList.add("add-to-cart-button");
      selectedButton.classList.add("clicked");
      selectedButton.id = `${menu.id}-selected-button`;
      selectedButton.innerHTML = html;
      addToCartButton?.remove();
      addToCartDiv.appendChild(selectedButton);
    } else {
      const selectedButton = document?.getElementById(
        `${menu.id}-selected-button`
      );
      selectedButton.innerHTML = html;
    }
  } else {
    const selectedButton = document?.getElementById(
      `${menu.id}-selected-button`
    );
    selectedButton?.remove();

    const newAddToCartButton = document.createElement("button");
    newAddToCartButton.classList.add("add-to-cart-button");
    newAddToCartButton.id = `${menu.id}-button`;
    newAddToCartButton.addEventListener("click", () => addToCart(menu, "new"));
    newAddToCartButton.innerHTML = `
      <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart" />
      <span> Add to Cart </span>
    `;

    addToCartDiv.appendChild(newAddToCartButton);
  }
  const totalCart = selectedMenu.reduce((total, value) => {
    return total + value.quantity;
  }, 0);

  const cardTitle = document.getElementById("cart-title");
  const totalCartDiv = document.getElementById("total-cart");
  const filledCart = document.getElementById("filled-cart");
  const cartCard = document.getElementById("cart-card");

  cardTitle.innerHTML = `Your Cart (${totalCart})`;

  let filledCartHtml = "";
  let totalPrice = 0;

  if (selectedMenu.length > 0) {
    if (document.getElementById("empty-cart")) {
      document.getElementById("empty-cart").remove();
    }

    selectedMenu
      .map((item, i) => {
        totalPrice += item.quantity * item.price;
        filledCartHtml += `
        <div class="menu">
          <div class="menu-detail">
            <span class="menu-name">${item.name}</span>
            <div class="price">
              <span class="quantity">${item.quantity}x</span>
              <span>@ $${item.price.toFixed(2)}</span>
              <span class="total-price">$${(item.quantity * item.price).toFixed(
                2
              )}</span>
            </div>
          </div>
          <img
            class="remove-icon"
            src="./assets/images/icon-remove-item.svg"
            alt="remove item icon"index
            data-index="${item.id}"
          />
        </div>
        <hr class="divider" />
    `;
      })
      .join("");

    filledCart.innerHTML = filledCartHtml;

    document.querySelectorAll(".remove-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        addToCart(
          selectedMenu.find((item) => item.id === index),
          "delete"
        );
      });
    });

    totalCartDiv.innerHTML = `
      <div class="price">
        <span>Order Total</span>
        <h2>$${totalPrice.toFixed(2)}</h2>
      </div>
      <div class="delivery">
        <img
          src="./assets/images/icon-carbon-neutral.svg"
          alt="icon-carbon-neutral"
        />
        <span>This is a <b>carbon-neutral</b> delivery</span>
      </div>
      <button class="cart-button" onclick='openModal()'>Confirm Order</button>
    `;
  } else {
    const emptyCart = document.createElement("div");
    emptyCart.classList.add("empty-cart");
    emptyCart.id = "empty-cart";
    emptyCart.innerHTML = `
      <img
        src="./assets/images/illustration-empty-cart.svg"
        alt="illustration-empty-cart"
      />
      <p class="sub-text">Your added items will appear here</p>
    `;

    cartCard.appendChild(emptyCart);

    filledCart.innerHTML = ``;
    totalCartDiv.innerHTML = ``;
  }
};

const openModal = () => {
  const layout = document.getElementById("layout");
  const backdropModal = document.getElementById("backdrop-modal");
  const cartModal = document.getElementById("cart-modal");
  const itemWrapper = document.getElementById("item-wrapper");
  const totalPrice = document.getElementById("total-price");
  layout.classList.add("no-scroll");
  backdropModal.style.display = "flex";
  cartModal.style.display = "flex";

  let total = 0;
  let html = ``;

  selectedMenu.map((menu) => {
    total += menu.quantity * menu.price;
    html += `
      <div class="item">
        <div class="menu">
          <img
            src="${menu.image.thumbnail}"
            alt="${menu.name}"
          />
          <div class="menu-detail">
            <p class="menu-name">${menu.name}</p>
            <div class="menu-quantity">
              <span>${menu.quantity}x</span>
              <span class="menu-price">@ $${menu.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="total-menu-price">
          <p>$${(menu.quantity * menu.price).toFixed(2)}</p>
        </div>
      </div>
      <hr class="divider" />
    `;
  });

  itemWrapper.innerHTML = html;

  totalPrice.innerHTML = `
    <span>Order Total</span>
    <h2>$${total.toFixed(2)}</h2>
  `;
};

const closeModal = () => {
  const layout = document.getElementById("layout");
  const backdropModal = document.getElementById("backdrop-modal");
  const cartModal = document.getElementById("cart-modal");
  layout.classList.remove("no-scroll");
  backdropModal.style.display = "none";
  cartModal.style.display = "none";

  selectedMenu.map((menu) => addToCart(menu, "delete"));
};
