// CHECKOUT DEL CARRITO DE COMPRAS
// Este checkout permite llenar los datos del usuario, mostrar lo que se tiene en el carrito y simular que la compra ha sido realizada 

// Condición para cargar carrito desde el localStorage. Si existe algo en el localStorage, se carga en el carrito
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

let cartCheckout = localStorage.getItem("cart");

cart = JSON.parse(localStorage.getItem("cart"));

// Función para mostrar el carrito de compras en HTML, utilizando forEach y modificando el DOM
const cartContainer = document.getElementById("cartContainer");

const showCart = () => {
    cartContainer.innerHTML = "";
    cart.forEach((product) => {
        const cartItem = document.createElement("ul");
        cartItem.classList.add("list-group");
        cartItem.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">    
                    <div class='cartImg'><img src='${product.img}'/></div>
                    <div>${product.name}</div>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn" onclick="updateItem(${product.id}, '-')">-</button>
                    <span class="badge bg-primary rounded-pill">${product.quantity}</span>
                    <button class="btn" onclick="updateItem(${product.id}, '+')">+</button>
                </div>
            </li>
            `;
        cartContainer.appendChild(cartItem);
    })
}

showCart();

// Función para sumar o restar la cantidad de los productos en el carrito de compras
const updateItem = (id, operator) => {
    let productInCart = cart.find((product) => product.id === id);
    if (productInCart) {
        operator == "-" ? productInCart.quantity-- : productInCart.quantity++;
        // Esta condición elimina el producto del carrito si la cantidad es menor que 1
        if (productInCart.quantity < 1) {
            cart.splice(cart.indexOf(productInCart), 1);
        }
    }
    calculateTotal();
    showCart();

    // Actualizando carrito de compras en el localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Botón para vaciar/eliminar todo el carrito de compras, haciendo uso de eventos
const buttonClearCart = document.getElementById("buttonClearCart");
buttonClearCart.addEventListener("click", () => {
    clearAllCart();
    calculateTotal();
})

// Función para vaciar/eliminar todo el carrito de compras
const clearAllCart = () => {
    cart = [];
    showCart();

    // Actualizando carrito de compras en el localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para calcular el total de la compra
const calculateTotal = () => {
    const total = document.getElementById("total");
    let totalPurchased = 0;
    cart.forEach((product) => {
        totalPurchased += product.price * product.quantity;
    });
    total.innerHTML = `$${totalPurchased}`;
    total.classList = "pTotal";
    localStorage.setItem("cartTotal", totalPurchased);

    if (totalPurchased == 0) {
        window.location.href = '../index.html';
    }
}

// Condición para cargar el precio total del carrito desde el localStorage. Si existe un precio total en el localStorage, se carga en el carrito
if (localStorage.getItem("cartTotal")) {
    let cartTotal = JSON.parse(localStorage.getItem("cartTotal"));
    calculateTotal();
}

/* Utilizando async y await para consumir una API de las provincias de Argentina, al momento en que se hace 
el checkout y el cliente tiene la opción de elegir la provincia en la que está */
const provinces = "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre";

async function obtainProvinces() {
    const response = await fetch(provinces);
    const data = await response.json();
    showProvinces(data);
}

obtainProvinces();

function showProvinces(data) {
    data.provincias.forEach(province => {
        const provincesContainer = document.getElementById("provincesContainer");
        const option = document.createElement("option");
        option.innerHTML = `
            <span>${province.nombre}</span> 
            `
        provincesContainer.appendChild(option);
    })
}

/* Función para finalizar la compra en el checkout, la cual está enlazada con el botón "Checkout" que está en HTML, donde se
utilizó el evento onclick. Esto muestra un modal que dice que la compra fue exitosa, borra los productos del carrito y devuelve 
a la página principal luego de 2.5 segundos*/
const finalCheckout = () => {
    if (!validateFields()) return;
    const modal = document.getElementById('exampleModal')
    modal.style.display = "block";
    modal.className = "modal fade show";
    localStorage.clear();

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2500);
}

// Función para validar el formulario del checkout
function validateFields() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let country = document.getElementById("country").value;
    let provincesContainer = document.getElementById("provincesContainer").value;

    if (firstName && lastName && address && country && provincesContainer) {
        return true;
    }
    return false;
}