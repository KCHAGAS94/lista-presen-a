let convidados = []

// Carrega os dados salvos no navegador ao iniciar
window.onload = function () {
  const dadosSalvos = localStorage.getItem('convidados')
  if (dadosSalvos) {
    convidados = JSON.parse(dadosSalvos)
    atualizarLista()
  }
}

function salvarNoLocalStorage() {
  localStorage.setItem('convidados', JSON.stringify(convidados))
}

function adicionarConvidado() {
  const nomeInput = document.getElementById('nomeInput')
  const docInput = document.getElementById('documentoInput')

  const nome = nomeInput.value.trim()
  const documento = docInput.value.trim()

  if (nome === '' || documento === '') {
    alert('Preencha o nome e o CPF/RG!')
    return
  }

  const novoConvidado = {
    id: Date.now(), // ID único
    nome: nome,
    documento: documento,
    presente: false
  }

  convidados.push(novoConvidado)
  salvarNoLocalStorage()
  atualizarLista()

  nomeInput.value = ''
  docInput.value = ''
}

function confirmarPresenca(id) {
  const convidado = convidados.find(c => c.id === id)
  if (convidado) {
    convidado.presente = true
    salvarNoLocalStorage()
    atualizarLista()
  }
}

function desmarcarPresenca(id) {
  const convidado = convidados.find(c => c.id === id)
  if (convidado) {
    convidado.presente = false
    salvarNoLocalStorage()
    atualizarLista()
  }
}

function excluirConvidado(id) {
  if (confirm('Tem certeza que deseja excluir este convidado?')) {
    convidados = convidados.filter(c => c.id !== id)
    salvarNoLocalStorage()
    atualizarLista()
  }
}

function atualizarLista() {
  const lista = document.getElementById('listaConvidados')
  lista.innerHTML = ''

  const listaOrdenada = [...convidados].sort((a, b) => {
    if (a.presente !== b.presente) {
      return a.presente - b.presente
    }
    return a.nome.localeCompare(b.nome)
  })

  listaOrdenada.forEach(convidado => {
    const item = document.createElement('li')
    item.className = convidado.presente ? 'presente' : ''
    item.innerHTML = `
      <span>
        <strong>${convidado.nome}</strong><br />
        <small>${convidado.documento}</small>
      </span>
      <div>
        ${
          convidado.presente
            ? `<button onclick="desmarcarPresenca(${convidado.id})">Desmarcar</button>`
            : `<button onclick="confirmarPresenca(${convidado.id})">Confirmar</button>`
        }
        <button onclick="excluirConvidado(${convidado.id})">Excluir</button>
      </div>
    `
    lista.appendChild(item)
  })

  filtrarConvidados()
}

function filtrarConvidados() {
  const termo = document.getElementById('pesquisaInput').value.toLowerCase()
  const itens = document.querySelectorAll('#listaConvidados li')

  itens.forEach(item => {
    const nome = item.querySelector('span').textContent.toLowerCase()
    if (nome.includes(termo)) {
      item.style.display = ''
    } else {
      item.style.display = 'none'
    }
  })
}
