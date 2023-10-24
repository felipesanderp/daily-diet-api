import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { hash } from 'bcrypt'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function profileRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      onRequest: [verifyJWT],
    },
    async (request) => {
      const [user] = await knex('users')
        .where('id', request.user.sub)
        .select('id', 'name', 'email')

      return {
        user,
      }
    },
  )

  app.put(
    '/',
    {
      onRequest: [verifyJWT],
    },
    async (request, response) => {
      const editProfileBodySchema = z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().optional(),
      })

      const { name, email, password } = editProfileBodySchema.parse(
        request.body,
      )

      if (password) {
        const passwordHash = await hash(password, 10)

        await knex('users').where('id', request.user.sub).update({
          password: passwordHash,
        })

        return response.status(202).send()
      }

      await knex('users').where('id', request.user.sub).update({
        name,
        email,
      })

      return response.status(202).send()
    },
  )
}
