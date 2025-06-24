

// Inicializa Firebase

const database = firebase.database();

function adicionarCompromisso() {
  const titulo = document.getElementById("titulo").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  if (titulo && data && hora) {
    const id = Date.now().toString();

    const compromisso = { id, titulo, data, hora };

    database.ref("compromissos/" + id).set(compromisso);

    // Limpa os campos
    document.getElementById("titulo").value = "";
    document.getElementById("data").value = "";
    document.getElementById("hora").value = "";
  }
}

function removerCompromisso(id) {
  database.ref("compromissos/" + id).remove();
}

function editarCompromisso(id, compromisso) {
  const novoTitulo = prompt("Editar título:", compromisso.titulo);
  if (novoTitulo !== null && novoTitulo.trim() !== "") {
    compromisso.titulo = novoTitulo;
    database.ref("compromissos/" + id).set(compromisso);
  }
}

function renderizarCompromissos() {
  const lista = document.getElementById("listaCompromissos");
  database.ref("compromissos").on("value", (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach((item) => {
      const dados = item.val();

      const li = document.createElement("li");

      const span = document.createElement("span");
      span.innerText = `${dados.data} ${dados.hora} - ${dados.titulo}`;
      li.appendChild(span);

      const btnEditar = document.createElement("button");
      btnEditar.innerText = "Editar";
      btnEditar.style.backgroundColor = "#3498db";
      btnEditar.onclick = () => editarCompromisso(dados.id, dados);
      li.appendChild(btnEditar);

      const btnExcluir = document.createElement("button");
      btnExcluir.innerText = "Excluir";
      btnExcluir.onclick = () => removerCompromisso(dados.id);
      li.appendChild(btnExcluir);

      lista.appendChild(li);
    });
  });
}

renderizarCompromissos();