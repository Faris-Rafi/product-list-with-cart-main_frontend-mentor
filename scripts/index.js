const selectedMenu = [];

const fetchMenus = async () => {
  const response = await fetch("../data.json");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const datas = await response.json();

  const items = document.getElementById("menus");

  return datas.map((menu, index) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");
    itemCard.innerHTML = `
      <div class="image-button">
        <img
          src="${menu.image.desktop}"
          alt="Waffle"
        />
        <button
          id="${index}-button"
          class="add-to-cart-button"
          onclick='addToCart(${JSON.stringify(menu)}, ${index}, "increment")'
        >
          <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart" />
          <span> Add to Cart </span>
        </button>
      </div>
      <div class="sub-text">
        <small>${menu.category}</small>
        <span class="sub-title">${menu.name}</span>
        <span class="price">$ ${menu.price.toFixed(2)}</span>
      </div>
    `;

    items.appendChild(itemCard);
  });
};

fetchMenus();

const addToCart = (menu, index, type) => {
  const isSameMenu = selectedMenu.some((item) => item.name === menu.name);

  if (isSameMenu && type === "increment") {
    selectedMenu
      .filter((item) => item.name === menu.name)
      .map((item) => (item.quantity += 1));
  } else if (type === "decrement") {
    selectedMenu
      .filter((item) => item.name === menu.name)
      .map((item) => (item.quantity -= 1));
  } else {
    const data = {
      ...menu,
      quantity: 1,
    };

    selectedMenu.push(data);
  }

  const addToCartButton = document.getElementById(`${index}-button`);
  addToCartButton.classList.add("clicked");
  addToCartButton.innerHTML = `
    <div 
      class="svg"
      onclick='addToCart(${JSON.stringify(menu)}, ${index}, "decrement")'
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 2">
        <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
      </svg>
    </div>
          
    <span> 
      ${selectedMenu.filter((item) => item.name === menu.name)[0].quantity} 
    </span>
           
    <div 
      class="svg" 
      onclick='addToCart(${JSON.stringify(menu)}, ${index}, "increment")'
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
        <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
      </svg>
    </div>
  `;
  addToCartButton.onclick = null;

  const totalCart = selectedMenu.reduce((total, value) => {
    return total + value.quantity;
  }, 0);

  const cardTitle = document.getElementById("cart-title");
  const totalCartDiv = document.getElementById("total-cart");

  const filledCart = document.getElementById("filled-cart");

  cardTitle.innerHTML = `Your Cart (${totalCart})`;

  if (document.getElementById("empty-cart")) {
    document.getElementById("empty-cart").remove();
  }

  let filledCartHtml = "";
  let totalPrice = 0;

  selectedMenu.map((item) => {
    totalPrice += item.quantity * item.price;
    filledCartHtml += `
      <div class="menu">
        <div class="menu-detail">
          <span class="menu-name">${item.name}</span>
          <div class="price">
            <span class="quantity">${item.quantity}x</span>
            <span>@ $ ${item.price.toFixed(2)}</span>
            <span class="total-price">$ ${(item.quantity * item.price).toFixed(
              2
            )}</span>
          </div>
        </div>
        <img
          src="./assets/images/icon-remove-item.svg"
          alt="remove item icon"
        />
      </div>
      <hr class="divider" />
    `;
  });

  filledCart.innerHTML = filledCartHtml;

  totalCartDiv.innerHTML = `
    <div class="price">
      <span>Order Total</span>
      <h2>$ ${totalPrice.toFixed(2)}</h2>
    </div>
    <div class="delivery">
      <img
        src="./assets/images/icon-carbon-neutral.svg"
        alt="icon-carbon-neutral"
      />
      <span>This is a <b>carbon-neutral</b> delivery</span>
    </div>
    <button class="cart-button">Confirm Order</button>
  `;
};
