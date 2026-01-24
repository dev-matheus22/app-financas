export let lancamentos = [];
// let idEmEdicao = null;

export const editRegister = (id) => {
  const item = lancamentos.find((l) => l.id === id);
  if (item) {
    return { success: true, item };
  } else {
    return { success: false, error: "Registro não encontrado" };
  }
};

export const verifyRegister = (objEmValidacao) => {
  if (!objEmValidacao.valor || isNaN(Number(objEmValidacao.valor)))
    return "Valor inválido";
  if (!objEmValidacao.categoria) return "Categoria inválida";
  if (!objEmValidacao.descricao) return "Descrição inválida";
  if (!objEmValidacao.data) return "Data inválida";
  if (objEmValidacao.tipo !== "entrada" && objEmValidacao.tipo !== "despesa")
    return "Tipo inválido";
  return null;
};

export const saveRegister  = (objInput, id = null) => {
  const erro = verifyRegister(objInput);
  if (erro) {
    return { success: false, error: erro };
  }

  if (id === null) {
    // Novo registro
    const newRegister = {...objInput, id: Date.now()}
    lancamentos.push(newRegister);
  } else {
    // Edição
    const index = lancamentos.findIndex((item) => item.id === id);
    if (index >= 0) lancamentos[index] = { ...objInput, id };
    // idEmEdicao = null;
  }
  return { success: true };
};

export const deleteRegister = (id) => {
    const lengthBefore = lancamentos.length
    lancamentos = lancamentos.filter(item => item.id !== id)

    if (lancamentos.length === lengthBefore) {
        return { success: false }
    }

    return { success: true }
}

