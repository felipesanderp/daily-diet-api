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

### [meals](https://github.com/felipesanderp/daily-diet-api/blob/main/src/routes/meals.ts)

As rotas de **meals** gerenciam as operações da aplicação relacionadas as refeições do usuário. Todas as rotas são protegidas, ou seja, o usuário deve estar logado para utiliza-lás.

`GET /`: Rota que retorna todas as _meals_ do usuário, com o seguinte formato:
```js 
{
  id: string;
  user_id: string;
  name: string;
  description: string;
  mealDate: string;
  mealHour: string;
  isOnTheDiet: boolean;
  created_at: string;
}[]
```

`POST /`: Utilizada para criar uma nova _meal_. Recebe no _body_ as seguintes informações:
```js 
{
  "name": "string",
  "description": "string"
  "mealDate": "string"
  "mealHour": "string"
  "isOnTheDiet": boolean
}
```
Após inserir os dados no banco de dados, retorna um _status code_ `201 OK`, de sucesso.

`GET /:id`: Utilizada para retornar as informções de uma única _meal_. Recebe via _params_ o _id_ de uma _meal_ e busca no banco de dados se ela existe. Retona um objeto com as informações da _meal_, se encontrada:
```js
{
  id: string;
  user_id: string;
  name: string;
  description: string;
  mealDate: string;
  mealHour: string;
  isOnTheDiet: boolean;
  created_at: string;
}
```

`PUT /:id`: Rota para atualizar uma _meal_. Recebe via _params_ o _id_ de uma _meal_ e via _body_ uma objeto no seguinte formato:
```js 
{
  "name": "string",
  "description": "string"
  "mealDate": "string"
  "isOnTheDiet": boolean
}
```
Após salvar as informações,  retorna um _status code_ `202 OK`, de sucesso.

`DELETE /:id`: Rota utilizada para deletar uma _meal_ . Recebe via _params_ o _id_ de uma _meal_ e busca no banco de dados se ela existe e se ela pertence ao usuário logado. Se o usuário não tiver permissão para deletar a _meal_, ou seja, ela não pertence a ele,
é retornado um _status code_ `401 Unauthorized`. Se pertencer a ele, a _meal_ é deletada do banco de dados.

`GET /summary`: Rota que trás um resumo das refeições do usuário, com as seguintes informações: ***totalMeals***, o total de refeições que o usuário tem registrado no banco de dados; ***totalOnTheDiet***, total de refeições do usuário que estão na dieta; ***totalOutsideTheDiet***, total de refeições que estão fora da dieta.

### [profile](https://github.com/felipesanderp/daily-diet-api/blob/main/src/routes/profile.ts)

As rotas de **profile** são responsáveis por trazer e atualizar informações do perfil do usuário.

`GET /profile`: Esta rota busca e devolve as informações do perfil do usuário. Utiliza do _id_ presente no JWT, que é gerado após fazer _login_ para buscar as informações no banco de dados. Retorna um objeto no seguinte formato:
```js 
{
  id: string
  name: string
  email: string
}
```

`PUT /profile`: Utilizada para atualizar as informações do perfil do usuário. Utiliza do _id_ presente no JWT, que é gerado após fazer _login_ para buscar as informações no banco de dados e pode receber no _body_ as seguintes informações:
```js 
{
  "name": "string"
  "email": "string"
  "password": "string"
}
```

Se as informações forem atualizadas com sucesso, um retorno com o _response code_ `202` é enviado.

<details>
<summary>Executando a aplicação</summary>

### :information_source: Executando a aplicação

Abaixo, segue as instruções para rodar a aplicação.

**1º**: Comece clonando este repositório:
```bash 
git clone https://github.com/felipesanderp/daily-diet-api.git
```

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
