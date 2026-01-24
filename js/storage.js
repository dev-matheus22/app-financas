let dadosSalvos = localStorage.getItem("lancamentos");

if (dadosSalvos !== null) {
    lancamentos = JSON.parse(dadosSalvos)
} else {
    lancamentos = []
}

const salvarLancamentos = () => {
    const objInput = dadosInput()
    const salvo = salvarRegistro(objInput, idEmEdicao)
    if (salvo) {
        limparFormulario()
    }
}

const atualizarStorage = () => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos))
}