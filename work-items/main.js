const apiUrl = 'http://localhost:8010';
window.onload = function () {
    /* 
        Verificação de login
    */
    if (checkLogin()) {
        buildTarefas();
        getUsers();
    }
    /* 
        Eventos dos botões
    */
    const btnAdd = document.getElementById('botao-add');
    btnAdd.addEventListener('click', addClick);

    const btnLogoff = document.getElementById('btn-logoff');
    btnLogoff.addEventListener('click', logoffClick);

    const btnFechaDialog = document.getElementById('fecha-dialog');
    btnFechaDialog.addEventListener('click', fechaDialog);

    const btnSalvarTarefa = document.getElementById('salvar-tarefa');
    btnSalvarTarefa.addEventListener('click', salvarTarefa);

}

let users = [];
let usersProject = [];

const getUsers = async function() {
    await fetch(`${apiUrl}/user`)
        .then(res => res.json())
        .then((data) => {
            users = data.data;
            getUsersByProjectId();
        })
}

const getUsersByProjectId = async function() {
    const projectId = JSON.parse(localStorage.getItem('projetoId'));
    const url = `${apiUrl}/project/user?projetoid=${projectId}`;
    await fetch(url)
        .then(res => res.json())
        .then((data) => {
            console.log(users)
            usersProject = users.filter((f) => {
                return data.users.some(s => s.pessoaid == f.pessoaid);
            })
        })
    console.log(usersProject)
}

const buildTarefas = function () {
    const projectId = JSON.parse(localStorage.getItem('projetoId'));
    const url = `${apiUrl}/task?ProjetoId=${projectId}`;
    fetch(url)
        .then(res => res.json())
        .then( async (data) => {
            /* 
                Criação dinâmica da página
            */
            const aFazer = Array.from(document.getElementsByClassName('container-fazer'))[0];
            const fazendo = Array.from(document.getElementsByClassName('container-fazendo'))[0];
            const feito = Array.from(document.getElementsByClassName('container-concluido'))[0];
            aFazer.innerHTML = fazendo.innerHTML = feito.innerHTML = '';
            aFazer.innerHTML = '<h4>Tarefas à fazer</h4>';
            fazendo.innerHTML = '<h4>Tarefas em andamento</h4>';
            feito.innerHTML = '<h4>Tarefas concluidas</h4>';
            await data.forEach((item) => {
                switch (item.status) {
                    case 0:
                        aFazer.innerHTML += containerTarefaBuilder(item);
                        break;
                    case 1:
                        fazendo.innerHTML += containerTarefaBuilder(item);
                        break;
                    case 2:
                        feito.innerHTML += containerTarefaBuilder(item);
                        break;
                }

            })
            const tarefa = Array.from(document.getElementsByClassName('tarefa'));
            tarefa.forEach(item => item.addEventListener('click', selecionaTarefa));
        }).catch(err => {
            console.log(err);
        })
}

const checkLogin = function () {
    return true;
}

const containerTarefaBuilder = function (data) {
    const nome = `<div class="tarefa tarefa-nome" data-id="${data.tarefaid}">
                        <h3>${data.nome}</h3>
                    </div>`;
    const div = `<div data-id="${data.tarefaid}" class="tarefa card">
                    <a class="tarefa-dado">
                        ${nome}
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

const salvarTarefa = function () {
    tasks = Array.from(document.getElementsByClassName('add-task-inp'));
    if (tasks.some(s => s.value === "" || !s)) {
        if (inputs.some(input => input.value === "" || !input)) {
            alert('Preencha todos os campos');
            form.style = 'form-invalid';
            return;
        }
    }
    const tarefa = {
        Nome: document.getElementById('tarefa-nome').value,
        Descricao: document.getElementById('tarefa-desc').value,
        ProjetoId: JSON.parse(localStorage.getItem('projetoId')),
        Status: 0
    }
    const url = `${apiUrl}/task/post`;
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(tarefa)
    })
        .then(res => res.json())
        .then((data) => {
            buildTarefas();
            fechaDialog();
        })
        .catch(err => console.log(err));
}

const fechaModal = function () {
    const modalTarefa = document.getElementById('dialog-tarefa');
    modalTarefa.close();
}

const acao = function () {
    const url = `${apiUrl}/task/put`;
    const statusAtual = JSON.parse(localStorage.getItem('tarefa-status'));
    const tarefaStatus = {
        TarefaId: JSON.parse(localStorage.getItem('tarefa-id')),
        Status:  statusAtual === 2 ? 0 : statusAtual + 1
    };
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(tarefaStatus)
    })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            buildTarefas();
            fechaModal();
        })
}

const selecionaTarefa = function (event) {
    const tarefaId = event.srcElement.dataset.id;
    const projetoId = JSON.parse(localStorage.getItem('projetoid'));
    const url = `${apiUrl}/task?TarefaId=${tarefaId}&ProjetoId=${projetoId}`;
    fetch(url)
        .then(res => res.json())
        .then(async (data) => {
            console.log(data);
            const dialogTarefa = document.getElementById('dialog-tarefa');
            dialogTarefa.innerHTML = '';
            const status = data[0].status === 0 ? 'À fazer' : data[0].status === 1 ? 'Fazendo' : 'Feito';
            const div = `<div>
                            <div class="lbl-fechar">
                                <button id="btn-fechar">fechar</button>
                            </div>
                            <div class="tarefa-nome">
                                <h4>${data[0].nome}</h4>
                            </div>
                            <div class="tarefa-descricao">
                                <p>${data[0].descricao}</p>
                            </div>
                            <div class="terafa-status">
                                <span>${status}</span>
                            </div>
                            <div class="lbl-fazer">
                                <button id="btn-fazer">${data[0].status === 0 ? 'Fazer' : data[0].status === 1 ? 'Concluir' : 'Desfazer'}</button>
                            </div>
                        </div>`;
            dialogTarefa.innerHTML += await div;
            document.getElementById('btn-fechar').addEventListener('click', fechaModal);
            const fazer = document.getElementById('btn-fazer');
            if (fazer) {
                fazer.addEventListener('click', acao);
            }
            localStorage.setItem('tarefa-status', data[0].status);
            localStorage.setItem('tarefa-id', tarefaId);
            dialogTarefa.showModal();
        })
}