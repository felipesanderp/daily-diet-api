import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { compare, hash } from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, response) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = loginBodySchema.parse(request.body)

    const user = await knex('users').where('email', email).select('*').first()

    if (!user) {
      return response.status(401).send({
        error: 'Check your e-mail or password!',
      })
    }

    const comparePassword = await compare(password, user.password)

    if (!comparePassword) {
      return response.status(401).send({
        error: 'Check your e-mail or password!',
      })
    }

    let sessionId = user.session_id

    if (sessionId) {
      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      })
    } else {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      })

      await knex('users').where('id', user.id).update('session_id', sessionId)
    }

    return response.status(201).send()
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
