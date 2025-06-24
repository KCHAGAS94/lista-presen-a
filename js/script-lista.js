const database = firebase.database()

function adicionarConvidado() {
  const nomeInput = document.getElementById('nomeInput')
  const docInput = document.getElementById('documentoInput')

  const nome = nomeInput.value.trim().toUpperCase()
  const documento = docInput.value.trim().toUpperCase()

  if (nome === '' || documento === '') {
    alert('Preencha o nome e o CPF/RG!')
    return
  }

  const id = Date.now().toString()

  const novoConvidado = {
    id,
    nome,
    documento,
    presente: false
  }

  database.ref('convidados/' + id).set(novoConvidado)

  nomeInput.value = ''
  docInput.value = ''
}

function confirmarPresenca(id) {
  database.ref('convidados/' + id + '/presente').set(true)
}

function desmarcarPresenca(id) {
  database.ref('convidados/' + id + '/presente').set(false)
}

function excluirConvidado(id) {
  if (confirm('Tem certeza que deseja excluir este convidado?')) {
    database.ref('convidados/' + id).remove()
  }
}

function atualizarLista(convidados) {
  const lista = document.getElementById('listaConvidados')
  lista.innerHTML = ''

  const listaOrdenada = Object.values(convidados || {}).sort((a, b) => {
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
            ? `<button class="desmarcar" onclick="desmarcarPresenca('${convidado.id}')">Desmarcar</button>`
            : `<button class="confirmar" onclick="confirmarPresenca('${convidado.id}')">Confirmar</button>`
        }
        <button class="excluir" onclick="excluirConvidado('${convidado.id}')">Excluir</button>
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
    item.style.display = nome.includes(termo) ? '' : 'none'
  })
}

// Sempre que mudar no Firebase, atualiza a lista
firebase.database().ref('convidados').on('value', snapshot => {
  atualizarLista(snapshot.val())
})
