import { FastifyInstance } from 'fastify'
// import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

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

  // TODO update profile
  // app.put('/', { preHandler: [checkSessionIdExists] }, async () => {})
}
