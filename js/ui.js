import {
  deleteRegister,
  saveRegister,
  editRegister,
  getRegisters,
  getUid,
} from "./service.js";

let idEmEdicao = null;
let chartCategorias = null;


const menuOn = (activeBtn) => {
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");
};

const dataInput = async () => {
  let valor = Number(document.getElementById("valor").value.trim());
  let descricao = document.getElementById("descricao").value.trim();
  let categoria = document.getElementById("categoria").value.trim();
  let tipo = document.getElementById("tipo").value.trim().toLowerCase();
  let data = document.getElementById("data").value;

  const objInput = { valor, descricao, categoria, tipo, data };

  const uidResult = getUid();
  if (!uidResult.success) {
    alert(uidResult.error.message);
    return uidResult;
  }

  const uid = uidResult.data.uid;
  const result = await saveRegister(objInput, idEmEdicao);

  if (!result.success) {
    return result;
  }

  cleanForm();
  idEmEdicao = null;
  await showList(uid);
  await loadDashboard(uid);
  showScreen("lista");

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
  if (!result.success) {
    alert(result.error.message);
    return result;
  }

  const item = result.data.register;
  idEmEdicao = item.id;

  document.getElementById("valor-edit").value = item.valor;
  document.getElementById("descricao-edit").value = item.descricao;
  document.getElementById("categoria-edit").value = item.categoria;
  document.getElementById("tipo-edit").value = item.tipo;
  document.getElementById("data-edit").value = item.data;

  showScreen("tela-editar");
  return result;
};

const showList = async (uid) => {
  const result = await getRegisters(uid);
  if (!result.success) {
    alert(result.error.message);
    return result;
  }

  const registers = result.data.registers;
  let lancamentoList = document.getElementById("lancamentoList");
  lancamentoList.innerHTML = "";

  if (registers.length === 0) {
    let card = document.createElement("div");
    let paragrafo = document.createElement("h4");
    let addButton = document.createElement("button");

    addButton.innerText = "Registrar";
    addButton.addEventListener("click", () => showScreen("adicionar"));

    paragrafo.innerText = "Que tal adicionar uma entrada/despesa?";
    paragrafo.classList.add("paragrafo");
    card.classList.add("empty-card");
    addButton.classList.add("btn");

    card.appendChild(paragrafo);
    card.appendChild(addButton);
    lancamentoList.appendChild(card);

    return result;
  }

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

    editButton.addEventListener("click", async () => {
      await fillForm(uid, lancamento.id);
    });

    removeButton.addEventListener("click", async () => {
      const del = await deleteRegister(lancamento.id);
      if (!del.success) return alert(del.error.message);
      await showList(uid);
      await loadDashboard(uid);
    });

    card.classList.add(
      "full-card",
      lancamento.tipo === "entrada" ? "entrada-card" : "despesa-card",
    );

    spanData.innerText = lancamento.data;
    spanCatTip.innerText = `${lancamento.categoria} | ${lancamento.tipo}`;
    spanDescricao.innerText = lancamento.descricao;
    spanValor.innerText = `R$${lancamento.valor.toFixed(2)}`;

    spanData.classList.add("data-format");
    spanDescricao.classList.add("descricao-format");
    spanCatTip.classList.add("categoria-tipo-format");
    spanValor.classList.add("valor-format");

    editButton.classList.add("small-btn");
    removeButton.classList.add("small-btn");

    card.append(spanData, spanDescricao, spanCatTip, spanValor);
    buttonContainer.append(editButton, removeButton);
    card.appendChild(buttonContainer);
    lancamentoList.appendChild(card);
  }

  return result;
};
const showScreen = (screenId) => {
  document.querySelectorAll(".tela").forEach((section) => {
    section.style.display = "none";
  });

  const active = document.getElementById(screenId);
  if (active) {
    active.style.display = "block";
  }
};

const loadDashboard = async (uid) => {
  const result = await getRegisters(uid);
  if (!result.success) {
    alert(result.error.message);
    return result;
  }

  const registers = result.data.registers;
  let entrada = registers.filter((i) => i.tipo === "entrada");
  let despesa = registers.filter((i) => i.tipo === "despesa");

  let totalEntrada = entrada.reduce((a, c) => a + c.valor, 0);
  let totalDespesa = despesa.reduce((a, c) => a + c.valor, 0);
  let saldo = totalEntrada - totalDespesa;
  let percentual = totalEntrada > 0 ? (totalDespesa / totalEntrada) * 100 : 0;

  document.getElementById("totalEntradas").innerText =
    `R$${totalEntrada.toFixed(2)}`;
  document.getElementById("totalDespesas").innerText =
    `R$${totalDespesa.toFixed(2)}`;
  document.getElementById("saldo").innerText = `R$${saldo.toFixed(2)}`;
  document.getElementById("percentualGasto").innerText =
    `${percentual.toFixed(2)}%`;

    renderCategoryChart(registers);


  return {
    success: true,
    data: { totalEntrada, totalDespesa, saldo, percentual },
  };
};

const renderCategoryChart = (registers) => {
  const despesas = registers.filter(r => r.tipo === "despesa");

  const categorias = {};

  despesas.forEach(d => {
    categorias[d.categoria] = (categorias[d.categoria] || 0) + d.valor;
  });

  const labels = Object.keys(categorias);
  const series = Object.values(categorias);

  const options = {
    chart: {
      type: "donut",
      height: 300
    },
    labels,
    series,
    theme: {
      mode: ""
    },
    legend: {
      position: "bottom"
    },
    dataLabels: {
      enabled: true
    }
  };

  if (chartCategorias) {
    chartCategorias.updateOptions({
      labels,
      series
    });
    return;
  }

  chartCategorias = new ApexCharts(
    document.querySelector("#chart-categorias"),
    options
  );

  chartCategorias.render();
};

export { dataInput, fillForm, loadDashboard, showList, menuOn, showScreen };
