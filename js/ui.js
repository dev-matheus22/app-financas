import { deleteRegister, saveRegister, editRegister, verifyRegister, lancamentos } from "./service"
let idEmEdicao = null;

const dadosInput = () => {
    let valor = Number(document.getElementById("valor").value.trim())
    let descricao = document.getElementById("descricao").value.trim()
    let categoria = document.getElementById("categoria").value.trim()
    let tipo = document.getElementById("tipo").value.trim().toLowerCase()
    let data = document.getElementById("data").value
 
    const objInput = {
        valor: valor,
        descricao: descricao,
        categoria: categoria,
        tipo: tipo,
        data: data
    }

    verifyRegister(objInput)
}

const limparFormulario = () => {
    document.getElementById("valor").value = ""
    document.getElementById("descricao").value = ""
    document.getElementById("categoria").value = ""
    document.getElementById("tipo").value = "entrada"
    document.getElementById("data").value = ""
}

const preencherFormulario = () => {
    const result = editRegister(id)
    if(!result.success){
        return
    }

    const item = result.item

    idEmEdicao = obj.item.id
    document.getElementById("valor").value = item.valor
    document.getElementById("descricao").value = item.descricao
    document.getElementById("categoria").value = item.categoria
    document.getElementById("tipo").value = item.tipo
    document.getElementById("data").value = item.data  
    mostrarTela("editar")
}

const mostrarLista = () => {
    let lancamentoList = document.getElementById("lancamentoList")
    lancamentoList.innerHTML = ""

    if (lancamentos.length === 0) {
        let card = document.createElement("div")
        let paragrafo = document.createElement("h4")
        let addButton = document.createElement("button")

        addButton.innerText = "Adicionar registro"
        addButton.addEventListener("click", function () {
            mostrarTela("adicionar")
        });

        paragrafo.innerText = "Que tal adicionar uma entrada/despesa?"

        paragrafo.classList.add("paragrafo")
        card.classList.add("empty-card")
        addButton.classList.add("btn")

        card.appendChild(paragrafo)
        card.appendChild(addButton)
        lancamentoList.appendChild(card)

        return;
    } else {
        for (const lancamento of lancamentos) {
            let card = document.createElement("div")
            let spanData = document.createElement("span")
            let spanCatTip = document.createElement("span")
            let spanDescricao = document.createElement("span")
            let spanValor = document.createElement("span")
            let editButton = document.createElement("button")
            let removeButton = document.createElement("button")

            // Criar container para os botões para melhor layout
            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("card-buttons"); // Nova classe para estilizar no CSS

            editButton.innerText = "Editar"
            removeButton.innerText = "Remover"

            editButton.addEventListener("click", () => editRegistro(lancamento.id))
            removeButton.addEventListener("click", () => deleteRegistro(lancamento.id))

            card.classList.add("full-card")

            // AQUI: ADICIONANDO CLASSE PARA DISTINÇÃO VISUAL (Entrada/Despesa)
            if (lancamento.tipo === 'entrada') {
                card.classList.add('entrada-card');
            } else if (lancamento.tipo === 'despesa') {
                card.classList.add('despesa-card');
            }

            spanData.classList.add("data-format")
            spanCatTip.classList.add("categoria-tipo-format")
            spanDescricao.classList.add("descricao-format")
            spanValor.classList.add("valor-format")
            editButton.classList.add("small-btn", "edit")
            removeButton.classList.add("small-btn", "remove")

            spanData.innerText = lancamento.data;
            spanCatTip.innerText = `${lancamento.categoria} | ${lancamento.tipo} `
            spanDescricao.innerText = lancamento.descricao;
            spanValor.innerText = `R$${lancamento.valor.toFixed(2)}`; // Formatando valor com 2 casas decimais

            card.appendChild(spanData)
            card.appendChild(spanDescricao)
            card.appendChild(spanCatTip)
            card.appendChild(spanValor)

            // Adicionar botões ao container e o container ao card
            buttonContainer.appendChild(editButton)
            buttonContainer.appendChild(removeButton)
            card.appendChild(buttonContainer)

            lancamentoList.appendChild(card)
        }
    }

}

const mostrarTela = (tela) => {
    let telas = ["dashboard", "adicionar", "editar", "lista"]

    for (const nomeTela of telas) {
        let divTela = document.getElementById("tela-" + nomeTela)

        if (nomeTela === tela) {
            divTela.style.display = "block"

            if (tela === "dashboard") {
                carregarDashboard() // <<< atualiza os dados REAL TIME
            }

        } else {
            divTela.style.display = "none"
        }
    }
}


const carregarDashboard = () => {
    let entrada = lancamentos.filter(item => item.tipo === "entrada")
    let despesa = lancamentos.filter(item => item.tipo === "despesa")
    let totalEntrada = entrada.reduce((acc, curr) => acc + curr.valor, 0)
    let totalDespesa = despesa.reduce((acc, curr) => acc + curr.valor, 0)
    let saldo = totalEntrada - totalDespesa
    let percentual = 0

    if (totalEntrada > 0) {
        percentual = (totalDespesa / totalEntrada) * 100;
    } else {
        percentual = 0;
    }

    document.getElementById("totalEntradas").innerText = `R$${totalEntrada.toFixed(2)}`
    document.getElementById("totalDespesas").innerText = `R$${totalDespesa.toFixed(2)}`
    document.getElementById("saldo").innerText = `R$${saldo.toFixed(2)}`
    document.getElementById("percentualGasto").innerText = `${percentual.toFixed(2)}%`

}

mostrarTela("dashboard")

function ativarMenu(btn) {
    let botoes = document.querySelectorAll(".nav-btn");
    botoes.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}