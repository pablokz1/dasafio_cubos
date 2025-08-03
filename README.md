# Dasafio Cubos

Este projeto é uma API REST construída com **Node.js**, **Express**, **TypeScript** e **Prisma ORM**, utilizando os princípios da **Clean Architecture** e **SOLID** para garantir escalabilidade, manutenibilidade e testabilidade.

A aplicação tem como objetivo atender aos requisitos do **desafio técnico da CUBOS TECNOLOGIA**, implementando funcionalidades como criação de contas, gerenciamento de transações (crédito, débito, estorno e transferências internas), além de autenticação segura com JWT.

A estrutura segue uma separação clara entre as camadas de domínio, aplicação, infraestrutura e interface, proporcionando independência de frameworks e forte coesão de responsabilidades.

---

## 🛠 Requisitos

Antes de iniciar, verifique se você possui instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/) (opcional, caso queira usar container para o banco de dados)

---

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/dasafio_cubos.git
cd dasafio_cubos
npm install
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
JWT_SECRET="sua_chave_jwt_secreta"
```

> Altere os valores conforme sua configuração de banco de dados.

---

## 🧱 Prisma

Gere o cliente Prisma e aplique as migrações (se houver):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 📦 Scripts

- **Iniciar em modo desenvolvimento**:
  
  ```bash
  npm run dev
  ```

- **Rodar testes unitários**:

  ```bash
  npm test
  ```

---

## 🔧 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express 5**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (Autenticação)**
- **Jest + Supertest** (Testes)
- **Swagger** (Documentação de API)
- **Docker** (opcional)

---

## 📖 Documentação da API

Após iniciar o servidor, acesse:

```
http://localhost:8000/api-docs
```

---

## 🧪 Testes

Os testes estão escritos com **Jest** e **Supertest**. Para executá-los:

```bash
npm test
```
