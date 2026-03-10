let cart = [];
let vegetables = [];

// LOAD VEGETABLES FROM BACKEND
document.addEventListener("DOMContentLoaded", () => {

    fetch("http://localhost:5500/api/vegetables")
        .then(res => res.json())
        .then(data => {
            vegetables = data;
            displayVegetables();
        })
        .catch(err => {
            console.error("Failed to load vegetables:", err);
        });

});

// DISPLAY VEGETABLES
function displayVegetables() {

    const container = document.querySelector(".products");
    container.innerHTML = "";

    vegetables.forEach(veg => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="img-placeholder"></div>
            <h4>${veg.name}</h4>
            <p>R${veg.price} ${veg.unit}</p>
        `;

        card.onclick = () => addToCart(veg);

        container.appendChild(card);
    });
}

// ADD TO CART
function addToCart(item) {
    cart.push(item);
    alert(item.name + " added to cart");
}

// SHOW CHECKOUT
function showCheckout() {

    if (cart.length === 0) {
        alert("Please add vegetables first!");
        return;
    }

    document.getElementById("checkout").style.display = "block";

    let list = "";
    cart.forEach(item => {
        list += `<p>${item.name} - R${item.price}</p>`;
    });

    document.getElementById("cartItems").innerHTML = list;
}

// CONFIRM ORDER (SEND TO BACKEND)
function confirmOrder() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const error = document.getElementById("errorMsg");
    const success = document.getElementById("successMsg");

    error.textContent = "";
    success.textContent = "";

    if (!name || !phone || !address) {
        error.textContent = "Please fill in all fields.";
        return;
    }

    fetch("http://localhost:5500/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customer: {
                name: name,
                email: "notprovided@email.com",
                phone: phone,
                address: address
            },
            cart: cart
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.message) {
            success.textContent =
                "Thanks for the order! Our team will contact you shortly.";
            cart = [];
        } else {
            error.textContent = "Order failed.";
        }

    })
    .catch(err => {
        error.textContent = "Server error. Is backend running?";
        console.error(err);
    });
}

const burgerBtn = document.getElementById("burgerBtn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const drawerClose = document.getElementById("drawerClose");

/* Open Drawer */
burgerBtn.addEventListener("click", () => {
  drawer.classList.add("active");
  overlay.classList.add("active");
});

drawerClose.addEventListener("click", () => {
drawer.classList.remove("active");
overlay.classList.remove("active");
});

/* Close Drawer when clicking overlay */
overlay.addEventListener("click", () => {
  drawer.classList.remove("active");
  overlay.classList.remove("active");
});