# Daily Diet API

Controle sua dieta diária.

Essa aplicaça foi desenvolvida durante o curso de Node.js da [Rocketseat](https://www.rocketseat.com.br/).

## :rocket: Tecnologias

- [Node.js](https://nodejs.org/en)
- [Fastify](https://fastify.dev/)
- [Fastify JWT](https://github.com/fastify/fastify-jwt)
- [Knex.js](https://knexjs.org/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

## :twisted_rightwards_arrows: Rotas

A aplicação conta com 10 rotas, separadas em `auth`, `meals` e `profile`.

### [auth](https://github.com/felipesanderp/daily-diet-api/blob/main/src/routes/auth.ts)

As rotas de **auth** são responsáveis pela autenticação dos usuários da aplicação, separadas em duas rotas:

`POST /login`: Rota responsável por realizar o _login_ do usuário. Recebe ***email*** e ***password*** do usuário, compara a senha do usuário com a senha salva no banco de dados e se estiver certo, devolve um objeto com um _token JWT_, contendo o _id_ do usuário no _sub_ e devolve as informaçãoes do usuário. Exemplo do objeto da resposta:
```js
{
  token: string
  user: {
    id: string
    email: string
    name: string
    created_at: string
  }
}  
```

`POST /register`: Utilizada para realizar o cadastro de um novo usuário. Recebe no _body_ o seguinte objeto: 
```js 
{
  "name": "string",
  "email": "string"
  "password": "string"
}
```
Após receber esse objeto com essas informações, a rota verifica se um usuário com o mesmo _e-mail_ ja existe no banco de dados, se já existe, retorna um erro. Se não existir, a senha do usuário é criptografada e salva no banco de dados com as demais infrmações passadas. Retorna um _status code_ `201 OK`, de sucesso.

<details>
<summary>Executando a aplicação</summary>

### :information_source: Executando a aplicação

</details>

<details>
<summary>Requisitos</summary>

## Regras da aplicação

- [ ] Deve ser possível criar um usuário
- [ ] Deve ser possível identificar o usuário entre as requisições
- [ ] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [ ] Deve ser possível apagar uma refeição
- [ ] Deve ser possível listar todas as refeições de um usuário
- [ ] Deve ser possível visualizar uma única refeição
- [ ] Deve ser possível recuperar as métricas de um usuário
  - [ ] Quantidade total de refeições registradas
  - [ ] Quantidade total de refeições dentro da dieta
  - [ ] Quantidade total de refeições fora da dieta
  - [ ] Melhor sequência de refeições dentro da dieta
- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
</details>

## :memo: License
This project is under the MIT license. See the [LICENSE](https://github.com/felipesanderp/daily-diet-api/blob/main/LICENSE) for more information.
---

Made with ♥ by Felipe Sander :wave: [Get in touch!](https://www.linkedin.com/in/felipesander)
