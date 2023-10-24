import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { compare, hash } from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).select('*').first()

    if (!user) {
      return reply.status(401).send({
        error: 'Check your e-mail or password!',
      })
    }

    const comparePassword = await compare(password, user.password)

    if (!comparePassword) {
      return reply.status(401).send({
        error: 'Check your e-mail or password!',
      })
    }

    try {
      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      )

      return reply.status(200).send({
        token,
        user,
      })
    } catch (err) {
      return reply.status(400).send()
    }
  })

  app.post('/register', async (request, response) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const passwordHash = await hash(password, 10)

    const checkUserExists = await knex('users')
      .select('id')
      .where('email', email)
      .first()

    if (checkUserExists) {
      return response.status(400).send({
        error: 'Este email já está vinculado à um usuário',
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password: passwordHash,
    })

    return response.status(201).send()
  })
}
