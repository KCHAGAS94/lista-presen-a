let convidados = []

// Carregar convidados do Firebase ao iniciar
firebase.database().ref('convidados').on('value', snapshot => {
  convidados = []
  snapshot.forEach(child => {
    convidados.push({
      nome: child.val().nome,
      documento: child.val().documento || '',
      presente: child.val().presente,
      key: child.key
    })
  })
  atualizarLista()
})

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
    nome: nome,
    documento: documento,
    presente: false
  }

  firebase.database().ref('convidados').push(novoConvidado)

  nomeInput.value = ''
  docInput.value = ''
}

function confirmarPresenca(key) {
  firebase.database().ref('convidados/' + key).update({ presente: true })
}

function desmarcarPresenca(key) {
  firebase.database().ref('convidados/' + key).update({ presente: false })
}

function excluirConvidado(key) {
  const confirmacao = confirm('Tem certeza que deseja excluir este convidado?')
  if (confirmacao) {
    firebase.database().ref('convidados/' + key).remove()
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
            ? `<button onclick="desmarcarPresenca('${convidado.key}')">Desmarcar</button>`
            : `<button onclick="confirmarPresenca('${convidado.key}')">Confirmar</button>`
        }
        <button onclick="excluirConvidado('${convidado.key}')">Excluir</button>
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
