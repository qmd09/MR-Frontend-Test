document.addEventListener("DOMContentLoaded", function () {
 fetchProductPageInfo();

 let selectedSize = {
  id: null,
  label: null,
 };
 let cart = [];
 let totalQty = 0;
 const miniCartContainer = document.getElementById("miniCart_container");
 const miniCartDropdownContainer = document.getElementById(
  "miniCart_dropdown_container"
 );
 const miniCartMyCartContainer = document.getElementById(
  "miniCart_myCart_container"
 );
 const miniCartItemTemplate = document.getElementById("miniCartItemTemplate");

 function fetchProductPageInfo() {
  fetch(
   "https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product"
  )
   .then((response) => response.json())
   .then((data) => {
    displayProductPageInfo(data);
   })
   .catch((error) => console.log("Error fetching product information:", error));
 }

 function displayProductPageInfo(product) {
  /* Call HTML element */
  const productName = document.getElementById("productPageName");
  const productPrice = document.getElementById("productPagePrice");
  const productImageURL = document.getElementById("productPageImage");
  const productSize = document.getElementById("productPageSize");
  const productDescription = document.getElementById("productPageDescription");

  /*Assign HTML element value*/
  productName.textContent = product.title;
  productPrice.textContent = "$" + product.price + ".00";
  productImageURL.src = product.imageURL;
  productDescription.textContent = product.description;
  product.sizeOptions.forEach((size) => {
   const optionBox = document.createElement("div");
   optionBox.className = "product_size_singleOption";
   optionBox.value = size.id;
   optionBox.textContent = size.label;

   optionBox.addEventListener("click", function () {
    const allOptions = productSize.querySelectorAll(
     ".product_size_singleOption"
    );
    allOptions.forEach((option) => option.classList.remove("selected"));

    this.classList.add("selected");

    selectedSize.id = size.id;
    selectedSize.label = size.label;
   });
   productSize.appendChild(optionBox);
  });
 }

 document
  .getElementById("addToCartButton")
  .addEventListener("click", function () {
   if (selectedSize.id === null) {
    document.getElementById("product_size_warning").textContent =
     "Please select an option.";
    return;
   } else {
    const selectedOption = {
     id: selectedSize.id,
     size: selectedSize.label,
     name: document.getElementById("productPageName").textContent,
     price: document.getElementById("productPagePrice").textContent,
     image: document.getElementById("productPageImage").src,
     quantity: 1,
    };
    addToMiniCart(selectedOption);
   }
  });

 function addToMiniCart(item) {
  const existingItemIndex = cart.findIndex(
   (cartItem) => cartItem.id === item.id
  );
  if (existingItemIndex !== -1) {
   cart[existingItemIndex].quantity++;
   totalQty++;
  } else {
   cart.push(item);
   totalQty++;
  }
  updateCart();
 }

 function updateCart() {
  miniCartDropdownContainer.innerHTML = "";
  document.getElementById("totalQty").textContent = "( " + totalQty + " )";
  cart.forEach((item) => {
   const miniCartItem = miniCartItemTemplate.content.cloneNode(true);
   miniCartItem.querySelector(".miniCartItem_image").src = item.image;
   miniCartItem.querySelector(".miniCartItem_name").textContent = item.name;
   const miniCartItemPrice = document.createElement("span");
   miniCartItemPrice.className = "miniCartItemPrice";
   miniCartItemPrice.textContent = item.price;
   miniCartItem.querySelector(".miniCartItem_qtyPrice").innerHTML =
    item.quantity + "x " + miniCartItemPrice.outerHTML;
   miniCartItem.querySelector(".miniCartItem_size").textContent =
    "Size: " + item.size;
   miniCartDropdownContainer.appendChild(miniCartItem);
  });
 }

 /*Mini Cart Toggle*/
 miniCartMyCartContainer.addEventListener("click", function () {
  miniCartDropdownContainer.classList.toggle("active");
 });
 document.addEventListener("click", function (event) {
  if (!event.target.closest("#miniCart_myCart_container")) {
   miniCartDropdownContainer.classList.remove("active");
   miniCartMyCartContainer.classList.remove("active");
  }
 });

 document.addEventListener("click", function (event) {
  if (event.target.closest("#miniCart_myCart_container")) {
   miniCartMyCartContainer.classList.toggle("active");
  }
 });
 /*Mini Cart Icon repalce */
 const cartIcon = document.getElementById("cartIcon");
 function updateIcon() {
  if (window.innerWidth <= 768) {
   cartIcon.innerHTML = '<i class="fa-solid fa-cart-shopping" id="miniCartIcon"></i>';
  } else {
   cartIcon.innerHTML = "My cart";
  }
 }
 updateIcon();
 window.addEventListener("resize", updateIcon);
});
