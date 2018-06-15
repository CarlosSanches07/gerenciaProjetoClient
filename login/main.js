window.onload = function () {

    const botaoLogin = document.getElementById('login-button');

    const doLogin = function () {
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const user = {
            'Login': login,
            'Senha': password
        }
        const url = 'http://localhost:8010/user/login';

        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({user: user})
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                if (!data.user) {
                    alert('login invalido');
                    return;
                }
                console.log(data);
                localStorage.setItem('usuario', JSON.stringify(data.user));
                alert(data);
            })
            .catch(err => console.log(err));
    }

    botaoLogin.addEventListener('click', doLogin);
}