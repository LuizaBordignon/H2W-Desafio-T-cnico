const API_URL = 'http://localhost:3000/clientes';

// TOAST

function showToast(tipo, mensagem, duracao = 4000) {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;

  toast.innerHTML = `
    <span class="toast-mensagem">${mensagem}</span>
    <button class="toast-fechar" onclick="removerToast(this.parentElement)">✕</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  toast._timer = setTimeout(() => removerToast(toast), duracao);
}

function removerToast(toast) {
  clearTimeout(toast._timer);
  toast.classList.remove('show');
  toast.classList.add('hide');

  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

// VALIDAÇÃO

function validarTelefone(valor) {
  return /^\d{8,15}$/.test(valor);
}

function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

// CRUD

async function carregarClientes() {
  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      showToast('error', 'Erro ao carregar clientes.');
      return;
    }

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

  } catch (erro) {
    showToast('error', 'Não foi possível conectar ao servidor.');
    console.error(erro);
  }
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
    showToast('warning', 'Preencha todos os campos.');
    return;
  }

  if (!validarEmail(email)) {
  showToast('error', 'E-mail inválido. Use o formato email@exemplo.com.');
  return;
  }

  if (!validarTelefone(telefone)) {
    showToast('error', 'Telefone inválido. Use apenas números.');
    return;
  }

  const corpo = { nome, email, telefone };

  try {
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      showToast('error', dados.mensagem || 'Erro ao salvar.');
      return;
    }

    showToast('success', id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
    fecharModal();
    carregarClientes();

  } catch (erro) {
    showToast('error', 'Erro de conexão. Verifique se o servidor está rodando.');
    console.error(erro);
  }
}

async function excluirCliente(id) {
  if (!confirm('Tem certeza que deseja excluir?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      showToast('error', dados.mensagem || 'Erro ao excluir cliente.');
      return;
    }

    showToast('success', 'Cliente excluído com sucesso!');
    carregarClientes();

  } catch (erro) {
    showToast('error', 'Erro de conexão. Verifique se o servidor está rodando.');
    console.error(erro);
  }
}

carregarClientes();