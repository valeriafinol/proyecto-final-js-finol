// SIMULADOR DE CARRITO DE COMRPRAS DE UNA PASTELERÍA

// Variable inicializada vacía para guardar la lista de productos una vez que se haga el fetch
let productsList = [];

// Mediante fetch se obtienen los datos de los productos desde el archivo products.json
fetch("../js/data/products.json")
    .then((response) => response.json())
    .then((data) => {
        listProducts(data);
        productsList = data;
    })
    .catch((error) => console.log(error));

// Array del carrito de compras, inicializándolo vacío
let cart = [];

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

    buttonsDisplay();
}

// Botón para ir al checkout 
const buttonCheckout = document.getElementById("buttonCheckout");
buttonCheckout.addEventListener("click", () => {
    window.location.href = '../pages/checkout.html';
})

// Container para linkear a HTML 
const emptyCartContainer = document.getElementById("emptyCartContainer");

// Container para linkear a HTML 
const divTotalPrice = document.getElementById("divTotalPrice");

// Función para mostrar: los botones y el total, ocultar: "El carrito está vacío"
const buttonsOn = () => {
    buttonClearCart.classList.remove("hidden");
    buttonCheckout.classList.remove("hidden");
    divTotalPrice.classList.remove("hidden");
    divTotalPrice.classList.add("d-flex");
    emptyCartContainer.classList.add("hidden");
}

// Función para ocultar: los botones y el total, mostrar: "El carrito está vacío"
const buttonsOff = () => {
    buttonClearCart.classList.add("hidden");
    buttonCheckout.classList.add("hidden");
    divTotalPrice.classList.add("hidden");
    divTotalPrice.classList.remove("d-flex");
    emptyCartContainer.classList.remove("hidden");
}

// Función que contiene la condición para mostrar y ocultar los contenidos del carrito según las acciones
const buttonsDisplay = () => {
    // Condición que oculta los botones y el total, y muestra "El carrito está vacío"
    if (cart.length < 1) {
        buttonsOff();
        // Condición que muestra los botones y el total, y oculta "El carrito está vacío"
    } else {
        buttonsOn();
    }
}

// Función para calcular el total de la compra
const total = document.getElementById("total");
const calculateTotal = () => {
    let totalPurchased = 0;
    cart.forEach((product) => {
        totalPurchased += product.price * product.quantity;
    });
    total.innerHTML = `$${totalPurchased}`;
    total.classList = "pTotal";

    // Actualizando el total del carrito de compras en el localStorage y en el botón del nav del carrito
    localStorage.setItem("cartTotal", totalPurchased);
    document.getElementById("nav-cartTotal").innerHTML = `$${totalPurchased}`;
}

// Condición para cargar carrito desde el localStorage. Si existe algo en el localStorage, se carga en el carrito
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    calculateTotal();
    buttonsDisplay();
}

// Función para agregar y mostrar la card de cada producto en HTML, utilizando forEach y modificando el DOM
function listProducts(products) {
    const productContainer = document.getElementById("productContainer");
    products.desserts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.innerHTML = `
            <div class="card">
                <img src="${product.img}" class="card-img-top imgProducts" alt=${product.name}/>
                <div class="card-body">
                    <div class="text-center">
                        <h5 class="fw-bolder">${product.name}</h5>
                        <p>$ ${product.price}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                    <button id="buttonAddToCart${product.id}" class="btn buttonStyle btn-outline-dark mt-auto">Add to cart</button>
                    </div>
                </div>
            </div>
            `;
        productContainer.appendChild(productCard);

        // Botón para agregar productos al carrito haciendo uso de eventos
        const buttonAddToCart = document.getElementById(
            `buttonAddToCart${product.id}`
        );
        buttonAddToCart.addEventListener("click", () => {
            addToCart(product.id);

            // Utilizando la librería toastify para que muestre un mensaje de notificación cada vez que se agregue un producto al carrito
            Toastify({
                text: "Product added to cart successfully",
                duration: 3000,
                gravity: "top",
                position: "left",
                style: {
                    background: "#594545",
                }
            }).showToast();
        })
    })
}

// Función para agregar productos al carrito de compras
function addToCart(id) {
    let item = productsList.desserts.find((product) => product.id === id);
    let productInCart = cart.find((product) => product.id === id);
    if (productInCart) {
        productInCart.quantity++;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    calculateTotal();

    // Guardando carrito de compras en el localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    buttonsDisplay();
}

// Mostrar el carrito de compras (linkeando a HTML)
const cartContainer = document.getElementById("cartContainer");
const buttonShowCart = document.getElementById("buttonShowCart");

// Botón para mostrar el carrito
buttonShowCart.addEventListener("click", () => {
    showCart();
});

// Función para agregar y mostrar el carrito de compras en HTML, utilizando forEach y modificando el DOM
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
    });
}

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

    buttonsDisplay();
}