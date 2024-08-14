# Projeto NestJS com Prisma e PostgreSQL

Este projeto é uma aplicação API desenvolvida usando NestJS, Prisma ORM e PostgreSQL como banco de dados. Ele inclui documentação Swagger disponível localmente e possui usuários pré-cadastrados para facilitar a configuração inicial.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações Node.js escaláveis.
- **Prisma**: ORM (Object-Relational Mapping) para TypeScript e Node.js.
- **PostgreSQL**: Banco de dados relacional utilizado pela aplicação.

## Endpoints Documentados com Swagger

A documentação dos endpoints da API está disponível via Swagger. Após iniciar a aplicação, você pode acessar a documentação em:

- **Swagger URL**: [http://localhost:3000/api-v1](http://localhost:3000/api-v1)

## Usuários Pré-Cadastrados

Ao iniciar o projeto, dois usuários são automaticamente cadastrados no banco de dados. É altamente recomendado que as senhas desses usuários sejam alteradas assim que possível.

### Usuário Admin

- **Email**: admin@admin.com
- **Senha**: admin12345
- **Roles**: admin

### Usuário Comum

- **Email**: user@user.com
- **Senha**: user12345
- **Roles**: user

## Como Rodar o Projeto

### 1. Usando Node.js

- **Pré-requisitos**: Certifique-se de ter o Node.js versão 20 instalada.
- **.env na raiz**: certifique-se de ter o arquivo .env na raiz

#### Instalar Dependências

Na raiz do projeto, execute o comando:

```bash
npm install
```

Iniciar a Aplicação
Para iniciar o servidor NestJS em modo de desenvolvimento, use o comando:

```bash
npm run start:dev
```

## Usando Docker

Se preferir rodar a aplicação utilizando Docker:

Pré-requisitos: Certifique-se de ter o Docker e Docker Compose instalados e npm.
Subir os Containers
Para iniciar a aplicação com Docker Compose, você pode escolher entre:

Manualmente:

```bash
docker-compose up -d
```

Usando NPM:

```bash
npm run start:docker
```

## Observações

Banco de Dados: O PostgreSQL é configurado automaticamente via Docker.
Migrações Prisma: As migrações do banco de dados Prisma são aplicadas automaticamente ao iniciar o Docker, garantindo que o banco de dados esteja sempre atualizado.
