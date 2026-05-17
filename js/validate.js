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