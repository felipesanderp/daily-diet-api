import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { hash } from 'bcrypt'

export async function profileRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id', 'name', 'email')

      return {
        user,
      }
    },
  )

  app.put(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const { sessionId } = request.cookies

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

        await knex('users').where('session_id', sessionId).update({
          password: passwordHash,
        })

        return response.status(202).send()
      }

      await knex('users').where('session_id', sessionId).update({
        name,
        email,
      })

      return response.status(202).send()
    },
  )
}
