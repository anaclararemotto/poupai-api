# API de Gerenciamento Financeiro Poup.ai
Este repositório contém o código-fonte de uma API RESTful desenvolvida em Node.js com Express e Mongoose, para o gerenciamento de dados financeiros. A API permite gerenciar bancos, contas, transações e usuários, incluindo funcionalidades de cadastro, listagem, exclusão e controle de saldo.

## 🚀 Tecnologias Utilizadas
- **Node.js:** Ambiente de execução JavaScript.
- **Express.js:** Framework web para Node.js, utilizado para construir a API.
- **Mongoose:** ODM (Object Data Modeling) para MongoDB, facilitando a interação com o banco de dados.
- **MongoDB:** Banco de dados NoSQL para armazenar os dados.
- **bcrypt:** Biblioteca para hash de senhas, garantindo a segurança dos usuários.
- **dotenv:** Para carregar variáveis de ambiente.
- **CORS:** Para lidar com requisições de diferentes origens.

## 📋 Funcionalidades
A API oferece as seguintes funcionalidades principais:

### Usuários
- **Cadastro de Usuário:** Registra novos usuários com nome, e-mail e senha (senha hashada).
- **Login de Usuário:** Autentica usuários com e-mail e senha.
- **Listar Usuários:** Retorna todos os usuários cadastrados.
- **Listar Usuário por ID:** Retorna um usuário específico pelo seu ID.

### Bancos
- **Cadastrar Banco:** Adiciona um novo banco ao sistema.
- **Listar Bancos:** Retorna todos os bancos cadastrados.
- **Listar Banco por ID:** Retorna um banco específico pelo seu ID.
- **Excluir Banco:** Remove um banco do sistema.

### Contas
- **Cadastrar Conta:** Cria uma nova conta, associada a um usuário existente.
- **Listar Contas:** Retorna todas as contas cadastradas.
- **Listar Conta por ID:** Retorna uma conta específica pelo seu ID.
- **Adicionar Saldo:** Adiciona um valor ao saldo de uma conta.
- **Subtrair Saldo:** Subtrai um valor do saldo de uma conta (com verificação de saldo insuficiente).
- **Transferir Saldo:** Realiza transferências entre duas contas (com verificação de saldo insuficiente).

### Transações
- **Criar Transação:** Registra receitas, despesas ou transferências, atualizando o saldo das contas envolvidas. Inclui validações para tipo de transação e valor.
- **Listar Transações:** Retorna todas as transações.
- **Listar Transação por ID:** Retorna uma transação específica pelo seu ID.
- **Excluir Transação:** Remove uma transação.

## ⚙️ Como Rodar a Aplicação
Siga os passos abaixo para configurar e executar a API em seu ambiente local:

### Pré-requisitos
Certifique-se de ter o seguinte instalado em sua máquina:

- Node.js: <a href="https://nodejs.org/en/download/">Download e Instalação</a>
- npm (gerenciador de pacotes do Node.js): Geralmente vem com o Node.js.
- MongoDB: <a href="https://www.mongodb.com/try/download/community"> Download e Instalação ou acesso a uma instância de MongoDB Atlas</a>

### Configuração
1. Clone o repositório:
```bash
git clone https://github.com/anaclararemotto/poupai-api.git
cd poupai-api
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente:
Na raiz do projeto, crie um arquivo chamado .env e adicione a seguinte variável:
```bash
DB_CONNECTION_STRING = string_de_conexao_disponibilizada
```

## Executando a API
Para iniciar o servidor da API, execute o seguinte comando:
```bash
npm run dev
```
A API estará rodando na porta 4000. Você verá uma mensagem no console como: Servidor escutando! e Conexão com o banco feita com sucesso!.

## 🌐 Endpoints da API
A API está configurada para ser acessada na porta 4000 (ex: http://localhost:4000).

### Bancos
- `GET /bancos` - Lista todos os bancos.
- `GET /bancos/:id` - Busca um banco pelo ID.
- `POST /bancos` - Cadastra um novo banco.
- `DELETE /bancos/:id` - Exclui um banco.

### Contas
- `GET /contas ` - Lista todas as contas.
- `GET /contas/:id` - Busca uma conta pelo ID.
- `POST /contas ` - Cadastra uma nova conta.

### Transações
- `GET /transacoes` - Lista todas as transações.
- `GET /transacoes/:id` - Busca uma transação pelo ID.
- `POST /transacoes` - Cria uma nova transação (receita, despesa, transferência).
- `DELETE /transacoes/:id` - Exclui uma transação.

### Usuários
- `GET /usuarios` - Lista todos os usuários.
- `GET /usuarios/:id` - Busca um usuário pelo ID.
- `POST /usuarios` - Cadastra um novo usuário.
- `POST /login` - Realiza o login do usuário.

## 🤝 Contribuição
Contribuições são bem-vindas! Se você tiver sugestões, melhorias ou encontrar algum bug, sinta-se à vontade para abrir uma issue ou enviar um pull request.