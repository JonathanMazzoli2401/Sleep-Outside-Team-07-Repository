// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Template not found: ${path}`);
  }
  return await res.text();
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  updateCartCount();
}

export async function convertToJson(response) {
  const jsonResponse = await response.json();

  if (response.ok) {
    return jsonResponse;
  } else {
    throw {
      name: "servicesError",
      message: jsonResponse,
    };
  }
}

export function formDataToJSON(formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function alertMessage(message, scroll = true) {
  removeAlerts();

  const main = document.querySelector("main");
  if (!main) return;

  const alert = document.createElement("div");
  alert.className = "alert-list";

  if (Array.isArray(message)) {
    alert.innerHTML = message.map((msg) => `<p>${msg}</p>`).join("");
  } else {
    alert.innerHTML = `<p>${message}</p>`;
  }

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export function removeAlerts() {
  document.querySelectorAll(".alert-list").forEach((alert) => alert.remove());
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCountElement = document.querySelector("#cart-count");

  if (!cartCountElement) return;

  const totalItems = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  cartCountElement.textContent = totalItems;

  if (totalItems > 0) {
    cartCountElement.classList.remove("hidden");
  } else {
    cartCountElement.classList.add("hidden");
  }
}