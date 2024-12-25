window.onload = function() {
    fecthOrders();
}

function fecthOrders() {
    fetch(login)
        .then(response => response.json())
        .then(user => {
            if(!user.message) {
                viewOrder(user.username);
            } else {
                alert('Please login!');
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Error fetching products:', error));
    }
    
    function viewOrder(user) {
        var orderList = [];
        const url = `/getOrders?user=${encodeURIComponent(user)}`;
        
        fetch(url)
        .then(response => response.json())
        .then(orders => {
            if (!orders.error) {
                orderList = orders;
                const listOrder = document.getElementById('orderList');
                listOrder.innerHTML = '';

                orderList.forEach(order => {
                    const itemTr = document.createElement('tr');
                    itemTr.innerHTML = `
                        <td>${order.name}</td>
                        <td>${order.price}</td>
                        <td>${order.status}</td>
                        <td>${order.date}</td>
                    `;
                    listOrder.appendChild(itemTr)
                })
            }
        })
        .catch(error => {
            console.error("Error: ", error);
        // Xử lý lỗi
    });
};

function backHome() {
    window.location.href = '/grocery';
};