let userList = [];

window.onload = function() {
    fetchUsers().then(users => {
        checkingUsers(users);
    });
}

// Sign In
function fetchUsers() {
    return fetch(userListUrl)
        .then(response => response.json())
        .then(users => {
            userList = users;
            return userList;
        });
    };
    
function checkingUsers(users) {
    const form = document.querySelector('form');
    const signInBtn = document.querySelector('.signInBtn')

    signInBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        if (username.length == 0 || password.length == 0) {
            alert('Do not enter spaces in the field!')
        } else {
            var existUser = users.find(user => user.name == username);
            if (existUser) {
                if (existUser.password === password) {
                    email = existUser.email
                    address = existUser.address

                    fetch(login, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password, email, address })
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json(); // Lấy URL trả về
                        }
                        // throw new Error('Failed to fetch');
                    })
                    .then(data => {
                        window.location.href = data.redirectUrl; // Chuyển hướng đến grocery.html
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                } else {
                    alert('Wrong password!');
                }
            } else {
                alert('User does not exist!');
            };
        };
    });
};


// Sign Up
let clickCount = 0;
function signupBtn() {
    const title = document.querySelector('#wrapper > div.header > h1');
    title.textContent = 'Register';

    function validateEmail(email) {
        // Kiểm tra cú pháp email bằng regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const btnNav = document.querySelector('#wrapper > div.button_nav')
    const signinBtn = document.querySelector('#wrapper > div.button_nav > button.signInBtn')
    const backBtn = document.querySelector('#wrapper > div.button_nav > button.backBtn')
    const hidden = document.querySelectorAll('.signup');

    clickCount ++;

    if (clickCount === 1) {
        btnNav.classList.add('active')
        signinBtn.classList.add('active')
        backBtn.classList.add('active')
        hidden.forEach(element => {
            element.classList.toggle('active');
        });
    } else if (clickCount > 1) {

        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const address = document.querySelector('input[name="text"]').value;

        if (username.length == 0 || password.length == 0 || email.length == 0 || address.length == 0) {
            alert('Do not enter spaces in the field!')
        } else if (!validateEmail(email)) {
            alert('Your email invalid');
        } else {
            fetch(userInsertInsertUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, address })
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Lấy URL trả về
                } else {
                    // Bắt lỗi từ database
                    return response.json().then(errorData => {
                        throw new Error(errorData.error);
                    });
                };
            })
            .then(data => {
                clickCount = 0;
                alert('Sign up successful!')
                window.location.href = data.redirectUrl; // Chuyển hướng đến grocery.html
            })
            .catch(error => {
                alert('Username or email already exists')
                console.log('Error:', error);
            });
        };
    };
};

// Back home
function backBtn() {
    window.location.href = '/'
};