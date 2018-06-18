window.onload = function() {
    const doRegister = function () {
        let form = document.getElementById('form-untouched');
        const inputs = Array.from(document.getElementsByClassName('label-input'));
        if (inputs.some(s => s.value === "")) {
            alert('Preencha todos os campos');
            form.style = 'form-required';
            return;
        }
        const user = {
            Nome: document.getElementById('inp-nome').value,
            Email: document.getElementById('inp-email').value,
            Login: document.getElementById('inp-login').value,
            Senha: document.getElementById('inp-senha').value
        };
        const url = 'http://localhost:8010/user/post';
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ user: user })
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                if (data.erro) {
                    alert('Login ou Email inválidos');
                    return;
                }
                alert('usuario criado com sucesso');
                window.location.assign('../login/login.html');
            })
            .catch(err => console.log(err));
    }
    const btnRegistro = document.getElementById('login-register');
    btnRegistro.addEventListener('click', doRegister);
    
}
