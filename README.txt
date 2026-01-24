Controle de Lançamentos Financeiros

Um sistema simples de controle de entradas e despesas financeiras, desenvolvido em JavaScript puro, que armazena os dados no LocalStorage do navegador, permitindo adicionar, editar, excluir e visualizar lançamentos em um dashboard interativo.

Funcionalidades

Adicionar lançamentos: Entradas ou despesas, com valor, categoria, descrição e data.

Editar lançamentos existentes.

Remover lançamentos.

Validação de dados: O sistema valida os campos para evitar valores inválidos.

Dashboard:

Exibe o total de entradas.

Exibe o total de despesas.

Calcula o saldo atual.

Mostra percentual de gastos em relação às entradas.

Persistência local: Todos os lançamentos são salvos no LocalStorage e permanecem mesmo após atualizar a página.

Interface dinâmica: Mudança de telas (Dashboard, Adicionar, Editar, Lista de lançamentos) sem recarregar a página.

Distinção visual entre entradas e despesas para facilitar a leitura.

Estrutura do Projeto

index.html: Estrutura principal das telas e botões de navegação.

style.css (opcional): Estilização dos cards, botões e dashboard.

app.js: Lógica principal do sistema:

Controle de telas.

Validação e manipulação de lançamentos.

Interação com o LocalStorage.

Atualização do dashboard em tempo real.

Como Usar

Abra o arquivo index.html em um navegador moderno.

No Dashboard, você verá o resumo das suas finanças.

Clique em Adicionar registro para criar uma nova entrada ou despesa.

Para editar ou remover um lançamento, vá até a Lista de lançamentos e use os botões correspondentes.

O dashboard será atualizado automaticamente conforme os lançamentos forem adicionados, editados ou removidos.

Estrutura dos Lançamentos

Cada lançamento é representado por um objeto JavaScript:

{
  id: Number,          // ID único (timestamp)
  valor: Number,       // Valor do lançamento
  descricao: String,   // Descrição do lançamento
  categoria: String,   // Categoria (ex: Alimentação, Transporte)
  tipo: String,        // 'entrada' ou 'despesa'
  data: String         // Data do lançamento (YYYY-MM-DD)
}

Validação

valor: Deve ser um número.

categoria: Não pode estar vazio.

descricao: Não pode estar vazia.

data: Deve estar preenchida.

tipo: Apenas entrada ou despesa.

Se algum campo estiver inválido, o sistema exibirá um alert informando o erro.

Estilo Visual

Cards de lançamentos:

Entradas: estilo verde (entrada-card).

Despesas: estilo vermelho (despesa-card).

Botões:

Pequenos botões de edição e remoção (small-btn).

Botões principais para navegação (btn).

Considerações

Sistema totalmente client-side.

Dados não são enviados para servidores, permanecendo apenas no navegador do usuário.

Funciona melhor em navegadores que suportam LocalStorage.