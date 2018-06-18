const apiUrl = 'http://localhost:8010';
window.onload = function () {
    /* 
        Verificação de login
    */
    if (checkLogin()) {
        buildProjects();
    }
    /* 
        Eventos dos botões
    */
    const btnAdd = document.getElementById('botao-add');
    btnAdd.addEventListener('click', addClick);

    const logoff = document.getElementById('botao-logoff');
    logoff.addEventListener('click', logoff);

    const btnLogoff = this.document.getElementById('botao-logoff');
    btnLogoff.addEventListener('click', logoffClick);

    const btnFechaDialog = document.getElementById('fecha-dialog');
    btnFechaDialog.addEventListener('click', fechaDialog);

    const btnSalvarProj = document.getElementById('salvar-projeto');
    btnSalvarProj.addEventListener('click', salvarProjeto);
}

const buildProjects = function () {
    let pessoa = JSON.parse(localStorage.getItem('usuario'));
    const url = `${apiUrl}/project?project=${pessoa.pessoaid}`;
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            /* 
                Criação dinâmica da página
             */
            const containerProjetos = document.getElementsByClassName('container-projeto');
            containerProjetos[0].innerHTML = "";
            data.projects.forEach(item => containerProjetos[0].innerHTML += containerProjetosBuilder(item));
            projetos = Array.from(document.getElementsByClassName('projeto'));
            projetos.forEach(item => item.addEventListener('click', salvaId));
        }).catch(err => {
            console.log(err);
        })
}

const checkLogin = function () {
    return true;
}

const containerProjetosBuilder = function (data) {
    const nome = `<div class="projeto-dado projeto-nome"><h3>${data.nome}</h3></div>`;
    const descricao = `<div class="projeto-dado projeto-descricao"><p>${data.descricao}<p/></div>`;
    const div = `<div data-id="${data.projetoid}" class="card">
                    <a href="../work-items/work-items.html" class="projeto-dado">
                        ${nome}${descricao}
                    </a>
                </div>`;
    return div;
}

const addClick = function () {
    const dialog = document.getElementById('add-dialog');
    dialog.showModal();
}

const logoffClick = function () {
    localStorage.clear();
    window.location.assign('../login/login.html');
}

const fechaDialog = function () {
    const dialog = document.getElementById('add-dialog');
    dialog.close();
}

const salvarProjeto = function () {
    const form = document.getElementById('form-required');
    form.style = 'form-untouched';
    const inputs = Array.from(document.getElementsByClassName('add-proj-inp'));
    if (inputs.some(input => input.value === "" || !input)) {
        alert('Preencha todos os campos');
        form.style = 'form-invalid';
        return;
    }
    const projeto = {
        Nome: document.getElementById('proj-nome').value,
        Descricao: document.getElementById('proj-desc').value,
        DataIni: document.getElementById('proj-data-ini').value,
        DataFim: document.getElementById('proj-data-fim').value,
        GerenteId: JSON.parse(localStorage.getItem('usuario')).pessoaid
    }
    const url = `${apiUrl}/project/post`;
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(projeto)
    })
    .then(res => res.json())
    .then((data) => {
        const dialog = document.getElementById('add-dialog');
        dialog.close();
        buildProjects();
    })
    .catch(err => console.log(err));
}

const salvaId = function(event) {
    const projetoId = event.srcElement.dataset.id;
    localStorage.setItem('projetoId', projetoId);
    window.location.assign('../work-items/work-items.html');
}