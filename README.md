# 🧠 Poup.ai - API de Gerenciamento Financeiro

Este repositório contém o código-fonte da **API Poup.ai**, uma solução RESTful para gerenciamento de dados financeiros.  
A API permite gerenciar **usuários, bancos, contas e transações**, com funcionalidades de **autenticação**, **controle de saldo** e **relatórios financeiros mensais**.

---

## 🚀 Tecnologias

A API é construída com as seguintes tecnologias:

- **Backend:** Node.js, Express.js  
- **Banco de Dados:** MongoDB (com Mongoose)  
- **Autenticação:** JWT (JSON Web Tokens) para controle de acesso e Bcrypt para hash de senhas  
- **Utilidades:**  
  - `dotenv` para variáveis de ambiente  
  - `cors` para controle de acesso  
  - `multer` para upload de arquivos  
  - `luxon` para gerenciamento de datas  

---

## 📋 Funcionalidades Principais

A API oferece um conjunto completo de funcionalidades, organizadas por módulo:

### 🔐 Usuários e Autenticação

- `POST /auth/`: Registra um novo usuário  
- `POST /auth/login`: Autentica um usuário e retorna um token JWT  
- `GET /auth/me`: Retorna os dados do usuário autenticado  
- `GET /auth/`: Lista todos os usuários (requer autenticação)  
- `GET /auth/:id`: Busca um usuário específico por ID (requer autenticação)  

### 🏦 Contas

- `GET /conta/minha`: Retorna a conta do usuário autenticado  
- `POST /conta`: Cria uma nova conta, associada a um usuário existente  
- `GET /conta/:id`: Busca uma conta por ID (requer autenticação)  

### 🏛️ Bancos

- `GET /banco/publico`: Lista alguns bancos públicos sem a necessidade de autenticação  
- `POST /banco`: Cadastra um novo banco (requer autenticação)  
- `GET /banco`: Lista todos os bancos (requer autenticação)  
- `GET /banco/:id`: Busca um banco por ID (requer autenticação)  
- `DELETE /banco/:id`: Exclui um banco (requer autenticação)  

### 🗂️ Categorias

- `POST /categoria`: Cadastra uma nova categoria  
- `GET /categoria`: Lista todas as categorias  
- `GET /categoria/:id`: Busca uma categoria por ID  
- `GET /categoria/tipo/:tipo`: Lista categorias por tipo (receita ou despesa)  
- `DELETE /categoria/:id`: Exclui uma categoria  

### 💸 Transações

- `POST /transacao/transacoes`: Cria uma nova transação (receita, despesa, ou transferência)  
- `GET /transacao/transacoes`: Lista todas as transações do usuário autenticado  
- `GET /transacao/transacoes/:id`: Busca uma transação por ID  
- `PUT /transacao/transacoes/:id`: Edita uma transação existente  
- `DELETE /transacao/transacoes/:id`: Exclui uma transação e ajusta o saldo  
- `POST /upload`: Faz o upload de um arquivo e o associa a uma transação  

### 📊 Relatórios

- `GET /transacao/total-receitas`: Retorna o total de receitas do mês atual para o usuário autenticado  
- `GET /transacao/total-despesas`: Retorna o total de despesas do mês atual para o usuário autenticado  
- `GET /transacao/receitas-mes`: Retorna um resumo de receitas por categoria no mês atual  
- `GET /transacao/despesas-mes`: Retorna um resumo de despesas por categoria no mês atual  

---

## ⚙️ Como Rodar a Aplicação Localmente

### ✅ Pré-requisitos

- **Node.js e npm:**  
  Verifique se você já possui o Node.js instalado com os seguintes comandos no terminal ou prompt de comando:

  ```bash
  node -v
  npm -v
  ```

  Se ambos os comandos retornarem versões (ex: `v18.17.1`), então o Node.js e o npm já estão instalados.

  Caso contrário, faça o download e instalação a partir do site oficial:  
  👉 https://nodejs.org/

- **MongoDB:**  
  Tenha acesso a uma instância local ou use um serviço como o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 📦 Configuração

1. Clone o repositório:

```bash
git clone https://github.com/anaclararemotto/poupai-api.git
cd poupai-api
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente:

```env
DB_URI=mongodb://seu_usuario:senha@host:porta/database
PORT=4000
```

### ▶️ Executando a API

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em: [http://localhost:4000](http://localhost:4000)

---

## 🤝 Contribuições

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir **issues** com sugestões ou problemas, ou enviar **pull requests** com melhorias.
