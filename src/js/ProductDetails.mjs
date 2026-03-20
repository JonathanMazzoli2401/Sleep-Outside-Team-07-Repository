import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];

    const existingProduct = cartItems.find(
      (item) => item.Id === this.product.Id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const productToAdd = { ...this.product, quantity: 1 };
      cartItems.push(productToAdd);
    }

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const container = document.querySelector("#product-detail");

    container.innerHTML = `
      <h2>${this.product.Name}</h2>
      <img src="${this.product.Images.PrimaryLarge}" alt="${this.product.Name}">
      <h3>${this.product.Brand.Name}</h3>
      <p>${this.product.DescriptionHtmlSimple}</p>
      <p><strong>Price:</strong> $${this.product.FinalPrice}</p>
      <button id="addToCart">Add to Cart</button>
    `;
  }
}