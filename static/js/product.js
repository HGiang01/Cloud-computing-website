let cart = [];
let productList = [];

// Fetch products when page loads
window.onload = function() {
    fetchProducts();
    fetchUser();
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartDisplay();
    }
}

// LOAD ITEMS
function fetchProducts() {
    fetch(productListUrl)
        .then(response => response.json())
        .then(products => {
            productList = products;
            const listItem = document.getElementById('list_item');
            listItem.innerHTML = '';
            
            products.forEach(product => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                    <div class="image" style="background-image: url('${product.image_url}')"></div>
                    <h4 class="name">${product.product_name}</h4>
                    <div class="selector_item">
                        <div class="selector_number">
                            <h4 class="price">${product.price} VND</h4>
                            <div class="quantity">Còn: ${product.quantity}</div>
                        </div>
                        <button class="buyBtn" onclick="addToCart(${product.product_id})">Add</button>
                    </div>
                `;
                listItem.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
;}

// USER CENTER
// Hi user function
function fetchUser() {
    fetch(login)
        .then(response => response.json())
        .then(user => {
            if (!user.message) {
                var account = document.querySelector('#nav > div.account > h4');
                account.textContent = `Hi, ${user.username}`
            }
        })
        .catch(error => console.error('Error fetching user: ', error));
}

function toggleCenter() {
    const center = document.querySelector('#nav > div.account_center'); 
    center.classList.toggle('active');
}

// Logout function
function logoutBtn() {
    fetch(logout)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            window.location.href = data.redirectUrl;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// View order function
function viewOrder() {
    var account = document.querySelector('#nav > div.account > h4')
    if (account.textContent == '') {
        alert('Please login!');
    } else {
        window.location.href = '/orders'
    };
};

// SHOPPING
function addToCart(productId) {
    const product = productList.find(p => p.product_id === productId);

    if (product.quantity == 0) {
        alert('Sold out!')
    } else {
        // Kiểm tra sản phẩm có trong giỏ hàng chưa
        const existingItem = cart.find(item => item.product_id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                // Spread syntax
                ...product,
                quantity: 1
            });
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        updateCartDisplay();
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = Number(item.price) * Number(item.quantity);
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.product_name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.product_name}</div>
                    <div class="cart-item-price">${item.price} VND</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.product_id}, 1)">+</button>
                    </div>
                </div>
                <button class="del-btn" onclick="removeFromCart(${item.product_id})">x</button>
            </div>
        `;
    });

    cartTotal.textContent = `${total} VND`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.product_id === productId);
    const product = productList.find(p => p.product_id === productId);
    if (item) {
        item.quantity += change
        // Kiểm tra còn đủ số lượng để đáp ứng hay không
        if (item.quantity > product.quantity) {
            item.quantity -= change
        }
        else if (item.quantity == 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function toggleCart() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.classList.toggle('active');
}

async function checkout() {
    var account = document.querySelector('#nav > div.account > h4')
    if (account.textContent == '') {
        alert('Please login!');
    } else if (cart.length === 0) {
        alert('Your shopping cart is empty');
    } else {
        // Hiển thông báo thanh toán
        const inform = document.getElementById('payInform');
        const priceElement = document.querySelector('#payInform > h1.price');
        let total = 0;
        cart.forEach(item => {
            // Tính tiền
            const itemTotal = Number(item.price) * Number(item.quantity);
            total += itemTotal;

            // Cập nhật lại giá trị
            var id = item.product_id;
            var product = productList.find(product => product.product_id == id);
            var quantity = product.quantity - item.quantity;
            console.log('Id: ', id)
            console.log('Name: ', product.product_name)
            console.log('Trong database: ', product.quantity)
            console.log('Trong giỏ: ', item.quantity)
            fetch(productUpdateUrl, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, quantity })
              })
              .then(response => response.json())
              .then(data => {
                if (data.message) {
                  console.log(`Quantity of ${id} (id) updated successfully`);
                } else if (data.error) {
                  alert("Error updating quantity: " + data.error);
                }
              })
              .catch(error => {
                console.error('Error:', error);
                alert("An error occurred");
              });

        });
        inform.classList.add('active')
        priceElement.textContent = `${total} VND`;

        // Order History
        user = account.textContent.substring(4);
        var price = total;
        var status = 'Completed'

        fetch(insertOrder, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, price, status })
          })
          .then(response => response.json())
          .then(data => {
            if (data.message) {
              console.log('Order inserted successfully');
            } else if (data.error) {
              alert("Error updating quantity: " + data.error);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert("An error occurred");
          });
        
        // Làm sạch giỏ hàng
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        updateCartDisplay();
    }
}

function closeInf() {
    const inform = document.getElementById('payInform');
    inform.classList.remove('active')
    location.reload()
}