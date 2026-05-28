import {
  getRegisters,
  getRegister,
} from "./service.js";
import {
  removeAction
} from "./controller.js"

let idEmEdicao = null;


const dataInput = async () => {
  let valor = Number(document.getElementById("valor").value.trim());
  let descricao = document.getElementById("descricao").value.trim();
  let categoria = document.getElementById("categoria").value.trim();
  let tipo = document.getElementById("tipo").value.trim().toLowerCase();
  let data = document.getElementById("data").value;

  const objInput = {
    valor: valor,
    descricao: descricao,
    categoria: categoria,
    tipo: tipo,
    data: data,
  };

  return objInput;

}

const cleanForm = () => {
  document.getElementById("valor").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("tipo").value = "entrada";
  document.getElementById("data").value = "";
};

const fillForm = async (id = null) => {
  if (!id) return;

  const result = await getRegister(id);
  if (result.success) {
    const item = result.data;
    setEditingId(item.id)

    document.getElementById("valor-edit").value = item.valor;
    document.getElementById("descricao-edit").value = item.descricao;
    document.getElementById("categoria-edit").value = item.categoria;
    document.getElementById("tipo-edit").value = item.tipo;
    document.getElementById("data-edit").value = item.data;
    showScreen("editar");
  } else {
    alert("Erro ao recuperar dados: " + result.error);
  }
};

const getNewData = () => {
  let newVal = Number(document.getElementById("valor-edit").value.trim());
  let newDesc = document.getElementById("descricao-edit").value.trim();
  let newCat = document.getElementById("categoria-edit").value.trim();
  let newType = document.getElementById("tipo-edit").value.trim();
  let newData = document.getElementById("data-edit").value.trim();

  const objInput = {
    valor: newVal,
    descricao: newDesc,
    categoria: newCat,
    tipo: newType,
    data: newData
  }

  return objInput
}

const refreshUI = async (uid) => {
  await showList(uid)
  await loadDashboard(uid)
}

const setEditingId = (id) => {
  idEmEdicao = id;
};

const getEditingId = () => {
  return idEmEdicao;
};

const showList = async (uid) => {
  const { success, data, error } = await getRegisters(uid);
  if (!success) {
    alert(error);
    return;
  }

  let lancamentoList = document.getElementById("lancamentoList");
  lancamentoList.innerHTML = "";

  if (data.length === 0) {
    let emptyState = renderEmptyState()
    lancamentoList.append(emptyState)
  } else {
    for (const lancamento of data) {
      let fullState = createCard(lancamento)
      lancamentoList.append(fullState)
    }
  }
}


const renderEmptyState = () => {
  let card = document.createElement("div");
  let paragrafo = document.createElement("h4");
  let addButton = document.createElement("button");

  addButton.innerText = "Registrar";
  addButton.addEventListener("click", function () {
    showScreen("adicionar");
  });

  paragrafo.innerText = "Que tal adicionar uma entrada/despesa?";

  paragrafo.classList.add("paragrafo");
  card.classList.add("empty-card");
  addButton.classList.add("btn");

  card.appendChild(paragrafo);
  card.appendChild(addButton);

  return card;
}

const createCard = (lancamento) => {
  let card = document.createElement("div");
  let spanData = document.createElement("span");
  let spanCatTip = document.createElement("span");
  let spanDescricao = document.createElement("span");
  let spanValor = document.createElement("span");
  let editButton = document.createElement("button");
  let removeButton = document.createElement("button");

  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("card-buttons");

  editButton.innerText = "Editar";
  removeButton.innerText = "Remover";

  editButton.addEventListener("click", async () => {
    await fillForm(lancamento.id);
  });

  removeButton.addEventListener("click", async () => {
    await removeAction(lancamento.id)
  });

  card.classList.add("full-card");

  if (lancamento.tipo === "entrada") {
    card.classList.add("entrada-card");
  } else if (lancamento.tipo === "despesa") {
    card.classList.add("despesa-card");
  }

  spanData.classList.add("data-format");
  spanCatTip.classList.add("categoria-tipo-format");
  spanDescricao.classList.add("descricao-format");
  spanValor.classList.add("valor-format");
  editButton.classList.add("small-btn", "edit");
  removeButton.classList.add("small-btn", "remove");

  spanData.innerText = lancamento.data;
  spanCatTip.innerText = `${lancamento.categoria} | ${lancamento.tipo} `;
  spanDescricao.innerText = lancamento.descricao;
  spanValor.innerText = `R$${lancamento.valor.toFixed(2)}`; //

  card.appendChild(spanData);
  card.appendChild(spanDescricao);
  card.appendChild(spanCatTip);
  card.appendChild(spanValor);

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(removeButton);
  card.appendChild(buttonContainer);

  return card
}


export const showScreen = async (tela) => {
  let telas = ["dashboard", "adicionar", "editar", "lista"];

  for (const nomeTela of telas) {
    let divTela = document.getElementById("tela-" + nomeTela);

    if (nomeTela === tela) {
      divTela.style.display = "block";
    } else {
      divTela.style.display = "none";
    }
  }
};


const loadDashboard = async (uid) => {
  const { success, data, error } = await getRegisters(uid);
  if (!success) {
    alert(error);
    return;
  }

  let entrada = data.filter((item) => item.tipo === "entrada");
  let despesa = data.filter((item) => item.tipo === "despesa");
  let totalEntrada = entrada.reduce((acc, curr) => acc + curr.valor, 0);
  let totalDespesa = despesa.reduce((acc, curr) => acc + curr.valor, 0);
  let saldo = totalEntrada - totalDespesa;
  let percentual = 0;

  if (totalEntrada > 0) {
    percentual = (totalDespesa / totalEntrada) * 100;
  } else {
    percentual = 0;
  }

  document.getElementById("totalEntradas").innerText =
    `R$${totalEntrada.toFixed(2)}`;
  document.getElementById("totalDespesas").innerText =
    `R$${totalDespesa.toFixed(2)}`;
  document.getElementById("saldo").innerText = `R$${saldo.toFixed(2)}`;
  document.getElementById("percentualGasto").innerText =
    `${percentual.toFixed(2)}%`;
};

export const menuOn = (btnClicado) => {
  const botoes = document.querySelectorAll(".nav-btn");
  botoes.forEach((btn) => btn.classList.remove("active")); // remove ativo de todos
  btnClicado.classList.add("active"); // adiciona ao clicado
};

export { dataInput, fillForm, loadDashboard, showList, getEditingId, getNewData };
