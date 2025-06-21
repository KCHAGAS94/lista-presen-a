let convidados = []

function adicionarConvidado() {
  const input = document.getElementById('nomeInput')
  const nome = input.value.trim()

  if (nome === '') {
    alert('Digite um nome válido!')
    return
  }

  convidados.push({ nome: nome, presente: false })
  input.value = ''
  atualizarLista()
}

function confirmarPresenca(index) {
  convidados[index].presente = true
  atualizarLista()
}

function desmarcarPresenca(index) {
  convidados[index].presente = false
  atualizarLista()
}

function atualizarLista() {
  const lista = document.getElementById('listaConvidados')
  lista.innerHTML = ''

  // Ordenar por: não presentes primeiro, depois ordem alfabética
  const listaOrdenada = [...convidados].sort((a, b) => {
    if (a.presente !== b.presente) {
      return a.presente - b.presente // não presentes primeiro
    }
    return a.nome.localeCompare(b.nome)
  })

  listaOrdenada.forEach((convidado, i) => {
    const indexOriginal = convidados.findIndex(c => c.nome === convidado.nome)

    const item = document.createElement('li')
    item.className = convidado.presente ? 'presente' : ''
    item.innerHTML = `
      <span>${convidado.nome}</span>
      ${
        convidado.presente
          ? `<button onclick="desmarcarPresenca(${indexOriginal})">Desmarcar entrada</button>`
          : `<button onclick="confirmarPresenca(${indexOriginal})">Confirmar entrada</button>`
      }
    `
    lista.appendChild(item)
  })

  filtrarConvidados() // mantém o filtro ativo
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
