const API_URL = 'http://localhost:3000/clientes';

async function carregarClientes() {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();

    const corpo = document.getElementById('corpo-tabela');
    corpo.innerHTML = '';

    clientes.forEach(cliente => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
        <button class="btn-editar" onclick="abrirModalEdicao(${cliente.id}, '${cliente.nome}', '${cliente.email}', '${cliente.telefone}')">Editar</button>
        <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
        `;
    corpo.appendChild(linha);
    });
}

function abrirModal() {
  document.getElementById('modal-titulo').textContent = 'Novo Cliente';
  document.getElementById('cliente-id').value = '';
  document.getElementById('input-nome').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('input-telefone').value = '';
  document.getElementById('modal').classList.remove('hidden');
}

function abrirModalEdicao(id, nome, email, telefone) {
  document.getElementById('modal-titulo').textContent = 'Editar Cliente';
  document.getElementById('cliente-id').value = id;
  document.getElementById('input-nome').value = nome;
  document.getElementById('input-email').value = email;
  document.getElementById('input-telefone').value = telefone;
  document.getElementById('modal').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modal').classList.add('hidden');
}

async function salvarCliente() {
  const id = document.getElementById('cliente-id').value;
  const nome = document.getElementById('input-nome').value.trim();
  const email = document.getElementById('input-email').value.trim();
  const telefone = document.getElementById('input-telefone').value.trim();

  if (!nome || !email || !telefone) {
    alert('Preencha todos os campos!');
    return;
  }

  const corpo = { nome, email, telefone };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
  }

  fecharModal();
  carregarClientes();
}

async function excluirCliente(id) {
  if (!confirm('Tem certeza que deseja excluir?')) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  carregarClientes();
}

carregarClientes();