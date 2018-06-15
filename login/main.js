const btnLogin = document.getElementById('login-button');

const doLogin = function () {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const user = {
        'Login': login,
        'Password': password
    }
    const url = 'http://localhost:8010/user/login';
    const body =  {
        user : user
    }
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(res => res.json())
    .then((data) => {
        if(!data.data) {
            alert('login invalido');
            return;
        }
        localStorage.setItem('usuario', data);
        alert(data);
    })
    .catch(err => console.log(err));
}

btnLogin.addEventListener('click', doLogin);