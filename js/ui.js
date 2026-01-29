import {
  deleteRegister,
  saveRegister,
  editRegister,
  getRegisters,
  getUid,
} from "./service.js";
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
  const { success: uidSuccess, uid, error: uidError } = getUid();
  if (!uidSuccess) {
    alert(uidError);
    return;
  }

  const result = await saveRegister(objInput, idEmEdicao);
  if (result.success === false) {
    return { success: false, error: result.error };
  } else {
    cleanForm();
    idEmEdicao = null;
    await showList(uid);
    await loadDashboard(uid);
    showScreen("lista");
  }
  return result;
};

const cleanForm = () => {
  document.getElementById("valor").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("tipo").value = "entrada";
  document.getElementById("data").value = "";
};

const fillForm = async (uid, id = null) => {
  if (!id) return;

  const result = await editRegister(id, uid);
  if (result.success) {
    const item = result.item;
    idEmEdicao = item.id;

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

const showList = async (uid) => {
  const { success, registers, error } = await getRegisters(uid);
  if (!success) {
    alert(error);
    return;
  }

  let lancamentoList = document.getElementById("lancamentoList");
  lancamentoList.innerHTML = "";

  if (registers.length === 0) {
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
    lancamentoList.appendChild(card);

    return;
  } else {
    for (const lancamento of registers) {
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

      const { success: uidSuccess, uid, error: uidError } = getUid();
      if (!uidSuccess) return alert(uidError);

      editButton.addEventListener("click", async () => {
        await fillForm(uid, lancamento.id);
      });

      removeButton.addEventListener("click", async () => {
        const result = await deleteRegister(lancamento.id);
        if (!result.success) return alert(result.error);
        await showList(uid);
        await loadDashboard(uid);
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

      lancamentoList.appendChild(card);
    }
  }
};

export const showScreen = async (tela) => {
  let telas = ["dashboard", "adicionar", "editar", "lista"];
  const { success: uidSuccess, uid, error: uidError } = getUid();
  if (!uidSuccess) {
    alert(uidError);
    return;
  }

  for (const nomeTela of telas) {
    let divTela = document.getElementById("tela-" + nomeTela);

    if (nomeTela === tela) {
      divTela.style.display = "block";

      if (tela === "dashboard") {
        await loadDashboard(uid);
      }
    } else {
      divTela.style.display = "none";
    }
  }
};


const loadDashboard = async (uid) => {
  const { success, registers, error } = await getRegisters(uid);
  if (!success) {
    alert(error);
    return;
  }

  let entrada = registers.filter((item) => item.tipo === "entrada");
  let despesa = registers.filter((item) => item.tipo === "despesa");
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

export { dataInput, fillForm, loadDashboard, showList };
