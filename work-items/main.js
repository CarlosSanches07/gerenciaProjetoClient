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

    const btnLogoff = this.document.getElementById('botao-logoff');
    btnLogoff.addEventListener('click', logoffClick);

    const btnFechaDialog = document.getElementById('fecha-dialog');
    btnFechaDialog.addEventListener('click', fechaDialog);

    const btnSalvarProj = document.getElementById('salvar-projeto');
    btnSalvarProj.addEventListener('click', salvarProjeto);
}

const buildProjects = function () {
    const url = `${apiUrl}/project?=${{ ProjetoId: null }}`;
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            /* 
                Criação dinâmica da página
             */
            const containerProjetos = document.getElementsByClassName('container-projeto');
            data.projects.forEach(item => containerProjetos[0].innerHTML += containerProjetosBuilder(item));
            projetos = Array.from(document.getElementsByClassName('projeto'));
            console.log(projetos)
            projetos.forEach(item => item.addEventListener('click', salvaId));
        }).catch(err => {
            console.log(err);
        })
}

const checkLogin = function () {
    return true;
}

const containerProjetosBuilder = function (data) {
    console.log(data);
    const nome = `<div class="projeto-dado projeto-nome"><h3>${data.nome}</h3></div>`;
    const descricao = `<div class="projeto-dado projeto-descricao"><p>${data.descricao}<p/></div>`;
    const div = `<div data-id="${data.projetoid}" class="projeto">
                    <a class="projeto-dado">
                        ${nome}${descricao}
                    </a>
                </div>`;
    return div;
}

const addClick = function () {
    localStorage.setItem('i', 'i');
    const dialog = document.getElementById('add-dialog');
    dialog.showModal();
}

const logoffClick = function () {
    console.log('botao logoff funcionando');
}

const fechaDialog = function () {
    const dialog = document.getElementById('add-dialog');
    dialog.close();
}

const salvarProjeto = function () {
    const projeto = {
        Nome: document.getElementById('proj-nome').value,
        Descricao: document.getElementById('proj-desc').value,
        DataIni: document.getElementById('proj-data-ini').value,
        DataFim: document.getElementById('proj-data-fim').value
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
        console.log(data);
        buildProjects();
    })
    .catch(err => console.log(err));
}

const salvaId = function(event) {
    const projetoId = event.srcElement.dataset.id;
    localStorage.setItem('projetoId', projetoId);
    window.location.assign('../work-items/work-items.html');
}